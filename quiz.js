(() => {
  "use strict";

  const PROGRESS_API =
    "https://accessible-learning-api.aaccessabilitylearningcenter.workers.dev";
  const REQUIRED_LESSONS = 10;
  const dataElement = document.getElementById("quizData");
  const form = document.getElementById("courseQuiz");
  const status = document.getElementById("quizStatus");
  const review = document.getElementById("quizReview");
  const setup = document.getElementById("certificateSetup");
  const certificateForm = document.getElementById("certificateForm");
  const certificateStatus = document.getElementById("certificateStatus");
  const certificate = document.getElementById("certificateSection");
  const nameInput = document.getElementById("certificateName");
  const printButton = document.getElementById("printCertificate");

  if (!dataElement || !form || !status || !review || !setup ||
      !certificateForm || !certificateStatus || !certificate ||
      !nameInput || !printButton) return;

  let data;
  try {
    data = JSON.parse(dataElement.textContent);
  } catch (error) {
    status.textContent = "This quiz could not be loaded. Return to the course and try again.";
    return;
  }

  if (!Array.isArray(data.questions) || !data.questions.length ||
      !data.questions.every(question =>
        Array.isArray(question.options) &&
        Number.isInteger(question.answer) &&
        question.answer >= 0 &&
        question.answer < question.options.length
      )) {
    status.textContent = "This quiz contains invalid question data. Return to the course and try again.";
    return;
  }

  const gradeButton = form.querySelector('button[type="submit"]');
  const questionInputs = [...form.querySelectorAll('input[type="radio"]')];
  const requiredCorrect = Math.ceil(data.questions.length * data.passPercent / 100);
  const readiness = document.createElement("div");
  const readinessText = document.createElement("p");
  const readinessAction = document.createElement("p");
  const answered = document.createElement("p");
  const retakeButton = document.createElement("button");
  let latestScore = 0;
  let questionOrder = data.questions.map((question, index) => index);
  let quizReady = false;
  let graded = false;

  readiness.className = "quiz-readiness";
  readiness.setAttribute("role", "status");
  readiness.setAttribute("aria-live", "polite");
  readiness.append(readinessText, readinessAction);
  form.before(readiness);

  answered.className = "quiz-answered";
  answered.setAttribute("aria-live", "polite");
  gradeButton.before(answered);

  retakeButton.type = "button";
  retakeButton.textContent = "Retake with new question order";
  retakeButton.hidden = true;
  gradeButton.after(retakeButton);

  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [result[index], result[randomIndex]] = [result[randomIndex], result[index]];
    }
    return result;
  }

  function randomizeQuiz() {
    const fieldsets = [...form.querySelectorAll(".quiz-question")];
    const fieldsetByQuestion = new Map(fieldsets.map(fieldset => {
      const inputName = fieldset.querySelector("input")?.name || "";
      return [Number(inputName.replace("question-", "")), fieldset];
    }));
    questionOrder = shuffle(data.questions.map((question, index) => index));
    const positionCount = Math.max(...data.questions.map(question => question.options.length));
    const correctPositions = shuffle(
      data.questions.map((question, index) =>
        index % Math.min(positionCount, question.options.length)
      )
    );

    questionOrder.forEach((questionIndex, visibleIndex) => {
      const fieldset = fieldsetByQuestion.get(questionIndex);
      const legend = fieldset.querySelector("legend");
      const labels = [...fieldset.querySelectorAll("label")];
      const correctValue = String(data.questions[questionIndex].answer);
      const correctLabel = labels.find(label =>
        label.querySelector("input")?.value === correctValue
      );
      const incorrectLabels = shuffle(labels.filter(label => label !== correctLabel));
      const correctPosition = Math.min(correctPositions[visibleIndex], incorrectLabels.length);
      incorrectLabels.splice(correctPosition, 0, correctLabel);

      legend.textContent = legend.textContent.replace(
        /^\d+\.\s*/,
        (visibleIndex + 1) + ". "
      );
      fieldset.dataset.visibleQuestion = String(visibleIndex + 1);
      incorrectLabels.forEach(label => fieldset.appendChild(label));
      form.insertBefore(fieldset, answered);
    });
  }

  function updateAnswered() {
    const count = data.questions.reduce((total, question, index) =>
      total + Number(Boolean(form.querySelector('input[name="question-' + index + '"]:checked'))), 0
    );
    answered.textContent = count + " of " + data.questions.length + " questions answered.";
  }

  function setQuizControls(enabled) {
    questionInputs.forEach(input => { input.disabled = !enabled; });
    gradeButton.disabled = !enabled;
  }

  function addReadinessLink(href, label) {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    readinessAction.replaceChildren(link);
  }

  async function checkReadiness() {
    quizReady = false;
    setQuizControls(false);
    readinessAction.replaceChildren();
    let studentId = "";
    try {
      studentId = localStorage.getItem("accessibleLearningStudentId") || "";
    } catch (error) {
      readinessText.textContent =
        "Final quiz locked. This browser is blocking the progress check. Allow site storage, then try again.";
      return;
    }

    if (!studentId) {
      readinessText.textContent =
        "Final quiz locked. Enter an anonymous Student ID so the site can confirm that all ten lessons are complete.";
      addReadinessLink("student-id.html", "Enter Student ID");
      return;
    }

    readinessText.textContent = "Checking lesson completion for this course...";
    try {
      const response = await fetch(
        PROGRESS_API + "/progress?student_id=" + encodeURIComponent(studentId)
      );
      const records = await response.json();
      if (!response.ok || !Array.isArray(records)) throw new Error("Invalid progress response");

      const completedLessons = new Set(
        records
          .filter(record =>
            record.course === data.course &&
            ["completed", "submitted"].includes(record.status)
          )
          .map(record => Number(record.lesson_number))
          .filter(number => Number.isInteger(number) && number >= 1 && number <= REQUIRED_LESSONS)
      );

      if (completedLessons.size < REQUIRED_LESSONS) {
        readinessText.textContent =
          "Final quiz locked. " + completedLessons.size + " of " + REQUIRED_LESSONS +
          " lessons are marked complete. Complete the remaining lessons, then return to this quiz.";
        addReadinessLink("lessons.html#" + data.slug + "-lessons", "Open this course's lessons");
        return;
      }

      quizReady = true;
      readinessText.textContent =
        "Ready. All ten lessons are marked complete. Use Tab to enter each answer group and the arrow keys to choose an answer.";
      setQuizControls(true);
    } catch (error) {
      readinessText.textContent =
        "The site could not verify lesson completion. Check your connection, then try again.";
      const retryButton = document.createElement("button");
      retryButton.type = "button";
      retryButton.textContent = "Check lesson completion again";
      retryButton.addEventListener("click", checkReadiness);
      readinessAction.replaceChildren(retryButton);
    }
  }

  function resultStorageKey() {
    const studentId = localStorage.getItem("accessibleLearningStudentId");
    return studentId
      ? "accessibleLearningQuizResults:" + studentId
      : "accessibleLearningQuizResults";
  }

  function saveResult(score) {
    try {
      const key = resultStorageKey();
      const legacyKey = "accessibleLearningQuizResults";
      const savedResults = localStorage.getItem(key);
      const legacyResults = key === legacyKey ? null : localStorage.getItem(legacyKey);
      const results = JSON.parse(savedResults || legacyResults || "{}");
      results[data.course] = { score, completedAt: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify(results));
      if (legacyResults) localStorage.removeItem(legacyKey);
    } catch (error) {
      // The quiz and certificate still work when local storage is unavailable.
    }
  }

  questionInputs.forEach(input => input.addEventListener("change", updateAnswered));
  randomizeQuiz();
  updateAnswered();
  checkReadiness();

  form.addEventListener("submit", event => {
    event.preventDefault();
    if (!quizReady || graded) return;

    const answers = data.questions.map((question, index) => {
      const selected = form.querySelector('input[name="question-' + index + '"]:checked');
      return selected ? Number(selected.value) : null;
    });
    const firstMissing = questionOrder.find(questionIndex => answers[questionIndex] === null);
    if (firstMissing !== undefined) {
      const missingFieldset = form.querySelector('input[name="question-' + firstMissing + '"]')?.closest("fieldset");
      const visibleQuestion = missingFieldset?.dataset.visibleQuestion ||
        String(questionOrder.indexOf(firstMissing) + 1);
      status.textContent =
        "Answer every question before grading. Question " + visibleQuestion + " is not answered.";
      missingFieldset?.querySelector("input")?.focus();
      return;
    }

    const correct = answers.reduce((total, answer, index) =>
      total + Number(answer === data.questions[index].answer), 0
    );
    latestScore = Math.round((correct / data.questions.length) * 100);
    const passed = latestScore >= data.passPercent;
    graded = true;
    setQuizControls(false);
    retakeButton.hidden = false;

    status.replaceChildren();
    const heading = document.createElement("h3");
    heading.tabIndex = -1;
    heading.textContent = passed
      ? "Passed: " + correct + " of " + data.questions.length + " correct, " + latestScore + " percent."
      : "Not passed yet: " + correct + " of " + data.questions.length + " correct, " + latestScore + " percent.";
    const note = document.createElement("p");
    note.textContent = passed
      ? "Your result was saved. You may create your course-completion certificate below."
      : "Review the explanations below, then retake the quiz. " + requiredCorrect +
        " correct answer" + (requiredCorrect === 1 ? " is" : "s are") + " required.";
    status.append(heading, note);

    review.replaceChildren();
    const reviewHeading = document.createElement("h3");
    reviewHeading.textContent = "Answer review";
    const list = document.createElement("ol");
    questionOrder.forEach(index => {
      const question = data.questions[index];
      const item = document.createElement("li");
      const result = document.createElement("p");
      const explanation = document.createElement("p");
      const isCorrect = answers[index] === question.answer;
      item.className = isCorrect ? "quiz-review--correct" : "quiz-review--incorrect";
      const outcome = document.createElement("strong");
      outcome.textContent = isCorrect ? "Correct." : "Incorrect.";
      result.append(outcome, document.createTextNode(" Your answer: " + question.options[answers[index]] + "."));
      if (!isCorrect) {
        result.append(document.createTextNode(" Correct answer: " + question.options[question.answer] + "."));
      }
      explanation.textContent = question.explanation;
      item.append(result, explanation);
      list.appendChild(item);
    });
    review.append(reviewHeading, list);

    setup.hidden = !passed;
    certificate.hidden = true;
    certificateStatus.textContent = "";
    if (passed) saveResult(latestScore);
    heading.focus();
  });

  retakeButton.addEventListener("click", () => {
    form.reset();
    graded = false;
    latestScore = 0;
    status.replaceChildren();
    review.replaceChildren();
    setup.hidden = true;
    certificate.hidden = true;
    certificateStatus.textContent = "";
    nameInput.value = "";
    retakeButton.hidden = true;
    randomizeQuiz();
    updateAnswered();
    setQuizControls(quizReady);
    readinessText.textContent =
      "Quiz reset. Question and answer order changed. Use Tab to enter each answer group and the arrow keys to choose an answer.";
    form.querySelector(".quiz-question input")?.focus();
  });

  certificateForm.addEventListener("submit", event => {
    event.preventDefault();
    const name = nameInput.value.trim().replace(/\s+/g, " ");
    if (!name) {
      certificateStatus.textContent = "Enter the learner's name before creating the certificate.";
      nameInput.focus();
      return;
    }
    document.getElementById("certificateStudentName").textContent = name;
    document.getElementById("certificateCourse").textContent = data.displayName;
    document.getElementById("certificateScore").textContent = latestScore + " percent";
    document.getElementById("certificateDate").textContent = new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(new Date());
    certificate.hidden = false;
    certificateStatus.textContent = "Certificate created. The name remains only on this page.";
    const certificateHeading = document.getElementById("certificate-heading");
    certificateHeading.tabIndex = -1;
    certificateHeading.focus();
  });

  printButton.addEventListener("click", () => {
    document.body.classList.add("print-certificate");
    window.print();
  });
  window.addEventListener("afterprint", () => document.body.classList.remove("print-certificate"));
})();
