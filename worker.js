const analyticsOrigins = new Set([
  "https://accessiblelearning.github.io",
  "https://accessiblelearningcenter.org",
  "https://www.accessiblelearningcenter.org"
]);

let analyticsSchemaPromise;

async function ensureAnalyticsSchema(env) {
  if (!analyticsSchemaPromise) {
    const salt = crypto.randomUUID() + crypto.randomUUID();
    analyticsSchemaPromise = env.DB.batch([
      env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS analytics_config (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL
        )
      `),
      env.DB.prepare(`
        INSERT OR IGNORE INTO analytics_config (key, value)
        VALUES ('visitor_salt', ?)
      `).bind(salt),
      env.DB.prepare(`
        CREATE TABLE IF NOT EXISTS site_analytics (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          visitor_hash TEXT NOT NULL,
          path TEXT NOT NULL,
          page_title TEXT NOT NULL,
          referrer_host TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
        )
      `),
      env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS idx_site_analytics_created
        ON site_analytics (created_at)
      `),
      env.DB.prepare(`
        CREATE INDEX IF NOT EXISTS idx_site_analytics_path
        ON site_analytics (path)
      `)
    ]).catch((error) => {
      analyticsSchemaPromise = undefined;
      throw error;
    });
  }

  await analyticsSchemaPromise;
}

async function anonymousVisitorHash(request, salt) {
  const address = request.headers.get("CF-Connecting-IP") || "unknown";
  const userAgent = request.headers.get("User-Agent") || "unknown";
  const data = new TextEncoder().encode(salt + "|" + address + "|" + userAgent);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function analyticsCors(request) {
  const origin = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": analyticsOrigins.has(origin) ? origin : "null",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Vary": "Origin"
  };
}

export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    const url = new URL(request.url);

    if (request.method === "OPTIONS" && url.pathname.startsWith("/analytics/")) {
      const origin = request.headers.get("Origin");
      return new Response(null, {
        status: analyticsOrigins.has(origin) ? 204 : 403,
        headers: analyticsCors(request)
      });
    }

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    if (url.pathname.startsWith("/analytics/")) {
      const analyticsHeaders = analyticsCors(request);
      const origin = request.headers.get("Origin");

      if (!analyticsOrigins.has(origin)) {
        return Response.json(
          { error: "This analytics request is not allowed." },
          { status: 403, headers: analyticsHeaders }
        );
      }

      if (url.pathname === "/analytics/collect" && request.method === "POST") {
        try {
          await ensureAnalyticsSchema(env);
          const data = await request.json();
          const path = String(data.path || "").trim().slice(0, 240);
          const title = String(data.title || "Untitled page").trim().slice(0, 160);

          if (!path.startsWith("/accessible-learning-center/")) {
            return Response.json(
              { error: "Invalid page path." },
              { status: 400, headers: analyticsHeaders }
            );
          }

          let referrerHost = "Direct or unknown";
          if (data.referrer) {
            try {
              const referrer = new URL(data.referrer);
              referrerHost = analyticsOrigins.has(referrer.origin)
                ? "Internal navigation"
                : referrer.hostname.slice(0, 160);
            } catch (error) {
              referrerHost = "Direct or unknown";
            }
          }

          const config = await env.DB.prepare(
            "SELECT value FROM analytics_config WHERE key = 'visitor_salt'"
          ).first();
          const visitorHash = await anonymousVisitorHash(request, config.value);

          await env.DB.prepare(`
            INSERT INTO site_analytics
              (visitor_hash, path, page_title, referrer_host)
            VALUES (?, ?, ?, ?)
          `).bind(visitorHash, path, title || "Untitled page", referrerHost).run();

          return Response.json(
            { success: true },
            { status: 201, headers: analyticsHeaders }
          );
        } catch (error) {
          return Response.json(
            { error: "Unable to record this page view." },
            { status: 500, headers: analyticsHeaders }
          );
        }
      }

      if (url.pathname === "/analytics/summary" && request.method === "GET") {
        try {
          await ensureAnalyticsSchema(env);
          const requestedDays = Number(url.searchParams.get("days"));
          const days = Number.isInteger(requestedDays)
            ? Math.min(90, Math.max(1, requestedDays))
            : 14;
          const modifier = "-" + days + " days";

          const [totals, daily, pages, referrers, firstView] = await Promise.all([
            env.DB.prepare(`
              SELECT COUNT(*) AS views,
                     COUNT(DISTINCT visitor_hash) AS unique_visitors
              FROM site_analytics
              WHERE created_at >= datetime('now', ?)
            `).bind(modifier).first(),
            env.DB.prepare(`
              SELECT substr(created_at, 1, 10) AS date,
                     COUNT(*) AS views,
                     COUNT(DISTINCT visitor_hash) AS unique_visitors
              FROM site_analytics
              WHERE created_at >= datetime('now', ?)
              GROUP BY substr(created_at, 1, 10)
              ORDER BY date DESC
            `).bind(modifier).all(),
            env.DB.prepare(`
              SELECT page_title, path, COUNT(*) AS views,
                     COUNT(DISTINCT visitor_hash) AS unique_visitors
              FROM site_analytics
              WHERE created_at >= datetime('now', ?)
              GROUP BY page_title, path
              ORDER BY views DESC
              LIMIT 20
            `).bind(modifier).all(),
            env.DB.prepare(`
              SELECT referrer_host, COUNT(*) AS views
              FROM site_analytics
              WHERE created_at >= datetime('now', ?)
                AND referrer_host <> 'Internal navigation'
              GROUP BY referrer_host
              ORDER BY views DESC
              LIMIT 20
            `).bind(modifier).all(),
            env.DB.prepare(
              "SELECT MIN(created_at) AS first_view FROM site_analytics"
            ).first()
          ]);

          return Response.json(
            {
              days,
              tracking_started: firstView.first_view,
              totals,
              daily: daily.results,
              popular_pages: pages.results,
              referrers: referrers.results
            },
            { headers: analyticsHeaders }
          );
        } catch (error) {
          return Response.json(
            { error: "Unable to load analytics." },
            { status: 500, headers: analyticsHeaders }
          );
        }
      }

      return Response.json(
        { error: "Analytics route not found." },
        { status: 404, headers: analyticsHeaders }
      );
    }

    if (url.pathname === "/health") {
      return Response.json(
        {
          status: "ok",
          message: "Accessible Learning API is running."
        },
        { headers: cors }
      );
    }

    if (url.pathname === "/student" && request.method === "POST") {
      try {
        const data = await request.json();
        const studentId = (data.student_id || "").trim();

        if (!studentId) {
          return Response.json(
            { error: "Student ID is required." },
            { status: 400, headers: cors }
          );
        }

        await env.DB.prepare(
          "INSERT OR IGNORE INTO students (student_id) VALUES (?)"
        )
          .bind(studentId)
          .run();

        return Response.json(
          {
            success: true,
            student_id: studentId
          },
          { headers: cors }
        );
      } catch (error) {
        return Response.json(
          { error: "Unable to create Student ID." },
          { status: 500, headers: cors }
        );
      }
    }

    if (url.pathname === "/progress" && request.method === "POST") {
      try {
        const data = await request.json();

        const studentId = (data.student_id || "").trim();
        const course = (data.course || "").trim();
        const lessonNumber = Number(data.lesson_number);
        const status = data.status || "in_progress";

        if (!/^[A-Za-z0-9_-]{3,64}$/.test(studentId) || !course || !Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 10) {
          return Response.json(
            { error: "Missing required information." },
            { status: 400, headers: cors }
          );
        }

        if (!["in_progress", "completed", "submitted"].includes(status)) {
          return Response.json(
            { error: "Invalid progress status." },
            { status: 400, headers: cors }
          );
        }

        await env.DB.prepare(`
          INSERT INTO progress
          (
            student_id,
            course,
            lesson_number,
            status,
            attempts,
            updated_at
          )
          VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP)

          ON CONFLICT(student_id, course, lesson_number)
          DO UPDATE SET
            status = excluded.status,
            attempts = CASE
              WHEN excluded.status = 'submitted' THEN attempts + 1
              ELSE attempts
            END,
            updated_at = CURRENT_TIMESTAMP
        `)
          .bind(
            studentId,
            course,
            lessonNumber,
            status
          )
          .run();

        return Response.json(
          { success: true },
          { headers: cors }
        );
      } catch (error) {
        return Response.json(
          { error: "Unable to save progress." },
          { status: 500, headers: cors }
        );
      }
    }

    if (url.pathname === "/progress" && request.method === "GET") {
      try {
        const studentId = url.searchParams.get("student_id");

        if (!studentId || !/^[A-Za-z0-9_-]{3,64}$/.test(studentId)) {
          return Response.json(
            { error: "Student ID is required." },
            { status: 400, headers: cors }
          );
        }

        const results = await env.DB.prepare(`
          SELECT
            course,
            lesson_number,
            status,
            attempts,
            last_score,
            feedback,
            updated_at
          FROM progress
          WHERE student_id = ?
          ORDER BY course, lesson_number
        `)
          .bind(studentId)
          .all();

        return Response.json(
          results.results,
          { headers: cors }
        );
      } catch (error) {
        return Response.json(
          { error: "Unable to load progress." },
          { status: 500, headers: cors }
        );
      }
    }

    return Response.json(
      {
        message: "Accessible Learning Center API"
      },
      { headers: cors }
    );
  },
};
