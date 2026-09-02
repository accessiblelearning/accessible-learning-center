const ALLOWED_ORIGIN = "https://accessiblelearning.github.io";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const COURSE_EXTENSIONS = new Map([
  ["Microsoft Word", new Set(["docx", "pdf", "txt", "brf"])],
  ["Microsoft Excel", new Set(["xlsx", "csv", "pdf"])],
  ["Microsoft PowerPoint", new Set(["pptx", "pdf"])],
  ["JAWS Screen Reader", new Set(["txt", "docx", "pdf", "brf"])],
  ["Windows 11", new Set(["txt", "docx", "pdf", "brf"])],
  ["Google Chrome", new Set(["txt", "docx", "pdf", "brf"])],
  ["Google Docs", new Set(["docx","pdf","txt","brf"])],
  ["Google Calendar", new Set(["pdf","txt","docx","brf"])],
  ["Adobe Acrobat and Accessible PDFs", new Set(["pdf","docx","txt","brf"])],
  ["BrailleBlaster", new Set(["brf","bbz","docx","pdf","txt"])],
  ["Mantis Q40", new Set(["brf","txt","docx","pdf"])],
  ["NLS Braille eReader", new Set(["brf","txt","docx","pdf"])],
  ["Cybersecurity for Screen Reader Users", new Set(["txt","docx","pdf","brf"])],
  ["Accessible Job Search", new Set(["docx","pdf","txt","brf"])],
]);

function corsHeaders(origin) {
  const headers = {
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Vary": "Origin",
  };

  if (origin === ALLOWED_ORIGIN) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function json(body, status, origin) {
  return Response.json(body, {
    status,
    headers: corsHeaders(origin),
  });
}

function safePart(value, fallback = "unknown") {
  const cleaned = String(value || "")
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return cleaned || fallback;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";

    if (request.method === "OPTIONS") {
      if (origin !== ALLOWED_ORIGIN) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, {
        status: 204,
        headers: corsHeaders(origin),
      });
    }

    const url = new URL(request.url);

    if (url.pathname === "/health" && request.method === "GET") {
      return json(
        { status: "ok", message: "Accessible Learning submissions are ready." },
        200,
        origin
      );
    }

    if (url.pathname !== "/submissions" || request.method !== "POST") {
      return json({ error: "Not found." }, 404, origin);
    }

    if (origin !== ALLOWED_ORIGIN) {
      return json({ error: "This submission source is not allowed." }, 403, origin);
    }

    try {
      const form = await request.formData();
      const studentId = String(form.get("student_id") || "").trim();
      const course = String(form.get("course") || "").trim();
      const lessonNumber = Number(form.get("lesson_number"));
      const rawSubmissionToken = String(form.get("submission_token") || "").trim();
      const submissionToken = rawSubmissionToken || crypto.randomUUID();
      const file = form.get("file");

      if (!/^[a-zA-Z0-9_-]{3,64}$/.test(studentId)) {
        return json(
          { error: "Enter a valid Student ID using letters, numbers, hyphens, or underscores." },
          400,
          origin
        );
      }

      const allowedExtensions = COURSE_EXTENSIONS.get(course);

      if (!allowedExtensions) {
        return json({ error: "Choose a supported course." }, 400, origin);
      }

      if (!Number.isInteger(lessonNumber) || lessonNumber < 1 || lessonNumber > 1000) {
        return json({ error: "A valid lesson number is required." }, 400, origin);
      }

      if (!/^[a-zA-Z0-9_-]{16,80}$/.test(submissionToken)) {
        return json({ error: "The submission retry token is invalid." }, 400, origin);
      }

      if (!(file instanceof File) || !file.name || file.size === 0) {
        return json({ error: "Choose a file to submit." }, 400, origin);
      }

      if (file.size > MAX_FILE_SIZE) {
        return json({ error: "The file must be 10 MB or smaller." }, 413, origin);
      }

      const extension = file.name.includes(".")
        ? file.name.split(".").pop().toLowerCase()
        : "";

      if (!allowedExtensions.has(extension)) {
        return json(
          {
            error:
              "Upload a supported " +
              course +
              " file: " +
              Array.from(allowedExtensions, value => value.toUpperCase()).join(", ") +
              ".",
          },
          415,
          origin
        );
      }

      const submittedAt = new Date().toISOString();
      const key = [
        safePart(studentId),
        safePart(course),
        `lesson-${lessonNumber}`,
        `${safePart(submissionToken)}.${extension}`,
      ].join("/");

      await env.SUBMISSIONS_BUCKET.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type || "application/octet-stream",
        },
        customMetadata: {
          studentId,
          course,
          lessonNumber: String(lessonNumber),
          originalFilename: file.name.slice(0, 200),
          submittedAt,
          submissionToken,
        },
      });

      return json(
        {
          success: true,
          message: "Your assignment was submitted successfully.",
          submission_id: key,
        },
        201,
        origin
      );
    } catch (error) {
      console.error("Submission failed", error);
      return json(
        { error: "Your assignment could not be submitted. Please try again." },
        500,
        origin
      );
    }
  },
};
