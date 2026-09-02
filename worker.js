export default {
  async fetch(request, env) {
    const cors = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors });
    }

    const url = new URL(request.url);

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
