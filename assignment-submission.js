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
  // Change to true when assignment uploads are intentionally restored.
  const UPLOADS_ENABLED = false;

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
  const submissionSection = form?.closest("[data-upload-ui]") || form?.closest("section");

  function createCompletionSection() {
    const section = document.createElement("section");
    const heading = document.createElement("h2");
    const explanation = document.createElement("p");
    const status = document.createElement("p");

    section.className = "lesson-completion";
    section.setAttribute("aria-labelledby", "lesson-completion-heading");
    heading.id = "lesson-completion-heading";
    heading.textContent = "Save your lesson progress";
    explanation.textContent =
      "After completing the assignment and checking your work, mark this lesson complete. You can undo it if needed. No assignment file will be uploaded.";
    status.id = "lessonCompletionStatus";
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");

    section.append(heading, explanation);

    if (!studentId) {
      const signInMessage = document.createElement("p");
      const studentLink = document.createElement("a");
      signInMessage.append("Enter an anonymous Student ID before saving completion. ");
      studentLink.href = "student-id.html";
      studentLink.textContent = "Enter Student ID";
      signInMessage.append(studentLink);
      section.append(signInMessage, status);
      return section;
    }

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Mark this lesson complete";
    button.setAttribute("aria-describedby", status.id);
    section.append(button, status);

    let isComplete = false;

    function showCompletionState(complete, savedStatus, announce = true) {
      isComplete = complete;
      button.disabled = false;
      button.textContent = complete
        ? "Undo lesson completion"
        : "Mark this lesson complete";
      button.setAttribute("aria-pressed", String(complete));
      if (!announce) return;
      status.textContent = complete
        ? (savedStatus === "submitted"
          ? "This lesson was completed through an earlier assignment submission. You can undo completion if needed."
          : "This lesson is saved as complete for Student ID " + studentId + ".")
        : "This lesson is not marked complete.";
    }

    async function checkCompletion() {
      try {
        const response = await fetch(
          PROGRESS_API + "/progress?student_id=" + encodeURIComponent(studentId)
        );
        const records = await response.json();
        if (!response.ok || !Array.isArray(records)) return;
        const record = records.find(item =>
          item.course === course &&
          Number(item.lesson_number) === lessonNumber &&
          ["completed", "submitted"].includes(item.status)
        );
        if (record) showCompletionState(true, record.status);
      } catch (error) {
        // The learner can still try to save completion if the initial check fails.
      }
    }

    button.addEventListener("click", async () => {
      const newStatus = isComplete ? "in_progress" : "completed";
      button.disabled = true;
      status.textContent = isComplete
        ? "Removing lesson completion..."
        : "Saving lesson completion...";
      try {
        const response = await fetch(PROGRESS_API + "/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student_id: studentId,
            course,
            lesson_number: lessonNumber,
            status: newStatus
          })
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          status.textContent = result.error || "Lesson completion could not be saved. Please try again.";
          button.disabled = false;
          return;
        }
        showCompletionState(newStatus === "completed", newStatus);
      } catch (error) {
        status.textContent = "There was a connection problem. Please try again.";
        button.disabled = false;
      }
    });

    checkCompletion();
    return section;
  }

  const completionSection = createCompletionSection();
  if (submissionSection) {
    submissionSection.before(completionSection);
  } else {
    document.querySelector("main")?.append(completionSection);
  }

  if (!UPLOADS_ENABLED) {
    submissionSection?.remove();
    return;
  }
  if (submissionSection) submissionSection.hidden = false;

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
