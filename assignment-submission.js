(() => {
  "use strict";

  const PROGRESS_API =
    "https://accessible-learning-api.aaccessabilitylearningcenter.workers.dev";
  const SUBMISSIONS_API =
    "https://accessible-learning-submissions.aaccessabilitylearningcenter.workers.dev";
  const COURSE = "Microsoft Word";
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_EXTENSIONS = new Set(["docx", "pdf", "txt", "brf"]);
  const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

  const script = document.currentScript;
  const lessonNumber = Number(script.dataset.lessonNumber);
  const studentId = localStorage.getItem("accessibleLearningStudentId");
  const studentDisplay = document.getElementById("studentDisplay");
  const form = document.getElementById("submissionForm");
  const fileInput = document.getElementById("assignmentFile");
  const submitButton = document.getElementById("submitLesson");
  const message = document.getElementById("submissionMessage");
  let duplicateConfirmed = false;

  if (!studentId) {
    message.textContent =
      "Please enter your Student ID before submitting this lesson.";
    fileInput.disabled = true;
    submitButton.disabled = true;

    const lineBreak = document.createElement("br");
    const loginLink = document.createElement("a");
    loginLink.href = "student-id.html";
    loginLink.textContent = "Enter Student ID";
    message.append(lineBreak, loginLink);
    return;
  }

  studentDisplay.textContent = "Student ID: " + studentId;

  const historyKey =
    "accessibleLearningLastSubmission:" + studentId + ":" + lessonNumber;

  function readLastSubmission() {
    try {
      return JSON.parse(localStorage.getItem(historyKey));
    } catch (error) {
      return null;
    }
  }

  function saveLastSubmission(file, submissionId) {
    try {
      localStorage.setItem(
        historyKey,
        JSON.stringify({
          filename: file.name,
          size: file.size,
          lastModified: file.lastModified,
          submittedAt: Date.now(),
          submissionId
        })
      );
    } catch (error) {
      // A successful upload does not depend on device history storage.
    }
  }

  const lastSubmission = readLastSubmission();

  if (lastSubmission && lastSubmission.filename) {
    const history = document.createElement("p");
    history.className = "submission-history";
    history.textContent =
      "Most recent submission from this device: " +
      lastSubmission.filename +
      ". Submitting it again will count as another attempt.";
    form.before(history);
  }

  fileInput.addEventListener("change", () => {
    duplicateConfirmed = false;
    message.textContent = fileInput.files[0]
      ? "Selected file: " + fileInput.files[0].name
      : "";
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = fileInput.files[0];

    if (!file) {
      message.textContent = "Choose your assignment file before submitting.";
      fileInput.focus();
      return;
    }

    const extension = file.name.includes(".")
      ? file.name.split(".").pop().toLowerCase()
      : "";

    if (!ALLOWED_EXTENSIONS.has(extension)) {
      message.textContent = "Choose a DOCX, PDF, TXT, or BRF file.";
      fileInput.focus();
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      message.textContent = "The file must be 10 MB or smaller.";
      fileInput.focus();
      return;
    }

    const previous = readLastSubmission();
    const sameRecentFile =
      previous &&
      previous.filename === file.name &&
      previous.size === file.size &&
      previous.lastModified === file.lastModified &&
      Date.now() - previous.submittedAt < DUPLICATE_WINDOW_MS;

    if (sameRecentFile && !duplicateConfirmed) {
      duplicateConfirmed = true;
      message.textContent =
        "This same file was submitted within the last five minutes. Press Upload and Submit again only if you want another attempt.";
      submitButton.focus();
      return;
    }

    submitButton.disabled = true;
    fileInput.disabled = true;
    message.textContent =
      "Uploading your Lesson " + lessonNumber + " assignment. Please wait.";

    try {
      const uploadData = new FormData();
      uploadData.append("student_id", studentId);
      uploadData.append("course", COURSE);
      uploadData.append("lesson_number", String(lessonNumber));
      uploadData.append("file", file);

      const uploadResponse = await fetch(
        SUBMISSIONS_API + "/submissions",
        {
          method: "POST",
          body: uploadData
        }
      );

      const uploadResult = await uploadResponse.json();

      if (!uploadResponse.ok || !uploadResult.success) {
        message.textContent =
          uploadResult.error || "Your assignment file could not be uploaded.";
        submitButton.disabled = false;
        fileInput.disabled = false;
        return;
      }

      message.textContent =
        "Your file was uploaded. Saving your lesson progress.";

      const progressResponse = await fetch(PROGRESS_API + "/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_id: studentId,
          course: COURSE,
          lesson_number: lessonNumber,
          status: "submitted"
        })
      });

      const progressResult = await progressResponse.json();

      if (!progressResponse.ok || !progressResult.success) {
        message.textContent =
          "Your assignment file was uploaded, but your progress could not be updated. Please contact the instructor.";
        return;
      }

      saveLastSubmission(file, uploadResult.submission_id);
      form.reset();
      duplicateConfirmed = false;
      message.textContent =
        "Lesson " +
        lessonNumber +
        " was submitted successfully. Your file and progress have been saved.";
    } catch (error) {
      message.textContent =
        "There was a connection problem. Please try submitting again.";
      submitButton.disabled = false;
      fileInput.disabled = false;
    }
  });
})();
