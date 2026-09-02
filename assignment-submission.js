(() => {
  "use strict";

  const PROGRESS_API =
    "https://accessible-learning-api.aaccessabilitylearningcenter.workers.dev";
  const SUBMISSIONS_API =
    "https://accessible-learning-submissions.aaccessabilitylearningcenter.workers.dev";
  const DEFAULT_COURSE = "Microsoft Word";
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const DEFAULT_EXTENSIONS = ["docx", "pdf", "txt", "brf"];
  const DUPLICATE_WINDOW_MS = 5 * 60 * 1000;

  const script = document.currentScript;
  const lessonNumber = Number(script.dataset.lessonNumber);
  const course = script.dataset.course || DEFAULT_COURSE;
  const extensionList = (script.dataset.allowedExtensions || DEFAULT_EXTENSIONS.join(","))
    .split(",")
    .map(value => value.trim().toLowerCase())
    .filter(Boolean);
  const allowedExtensions = new Set(extensionList);
  const allowedLabel = extensionList.map(value => value.toUpperCase()).join(", ");
  const studentId = localStorage.getItem("accessibleLearningStudentId");
  const studentDisplay = document.getElementById("studentDisplay");
  const form = document.getElementById("submissionForm");
  const fileInput = document.getElementById("assignmentFile");
  const submitButton = document.getElementById("submitLesson");
  const message = document.getElementById("submissionMessage");
  let duplicateConfirmed = false;
  let activeSubmissionToken = "";

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
    "accessibleLearningLastSubmission:" +
    studentId +
    ":" +
    course +
    ":" +
    lessonNumber;

  function readLastSubmission() {
    try {
      const currentHistory = localStorage.getItem(historyKey);
      if (currentHistory) return JSON.parse(currentHistory);

      if (course === DEFAULT_COURSE) {
        const legacyKey =
          "accessibleLearningLastSubmission:" + studentId + ":" + lessonNumber;
        return JSON.parse(localStorage.getItem(legacyKey));
      }

      return null;
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
    activeSubmissionToken = "";
    message.textContent = fileInput.files[0]
      ? "Selected file: " + fileInput.files[0].name
      : "";
  });

  function createSubmissionToken() {
    if (globalThis.crypto && typeof globalThis.crypto.randomUUID === "function") {
      return globalThis.crypto.randomUUID();
    }

    return (
      Date.now().toString(36) +
      "-" +
      Math.random().toString(36).slice(2) +
      Math.random().toString(36).slice(2)
    );
  }

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

    if (!allowedExtensions.has(extension)) {
      message.textContent = "Choose one of these file types: " + allowedLabel + ".";
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
      "Uploading your " + course + " Lesson " + lessonNumber + " assignment. Please wait.";

    try {
      if (!activeSubmissionToken) {
        activeSubmissionToken = createSubmissionToken();
      }

      const uploadData = new FormData();
      uploadData.append("student_id", studentId);
      uploadData.append("course", course);
      uploadData.append("lesson_number", String(lessonNumber));
      uploadData.append("submission_token", activeSubmissionToken);
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

      saveLastSubmission(file, uploadResult.submission_id);
      message.textContent =
        "Your file was uploaded. Saving your lesson progress.";

      const progressResponse = await fetch(PROGRESS_API + "/progress", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          student_id: studentId,
          course: course,
          lesson_number: lessonNumber,
          status: "submitted"
        })
      });

      const progressResult = await progressResponse.json();

      if (!progressResponse.ok || !progressResult.success) {
        message.textContent =
          "Your assignment file is safely uploaded, but progress confirmation did not finish. Do not upload it again. Check My Progress, then contact the instructor if it is not listed.";
        return;
      }

      form.reset();
      duplicateConfirmed = false;
      activeSubmissionToken = "";
      message.textContent =
        course +
        " Lesson " +
        lessonNumber +
        " was submitted successfully. Your file and progress have been saved.";
    } catch (error) {
      message.textContent =
        "The connection ended before confirmation. Press Upload and Submit again to safely retry the same upload.";
      submitButton.disabled = false;
      fileInput.disabled = false;
    }
  });
})();
