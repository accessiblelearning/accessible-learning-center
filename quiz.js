(() => {
  "use strict";
  const data = JSON.parse(document.getElementById("quizData").textContent);
  const form = document.getElementById("courseQuiz");
  const status = document.getElementById("quizStatus");
  const review = document.getElementById("quizReview");
  const setup = document.getElementById("certificateSetup");
  const certificateForm = document.getElementById("certificateForm");
  const certificateStatus = document.getElementById("certificateStatus");
  const certificate = document.getElementById("certificateSection");
  const nameInput = document.getElementById("certificateName");
  const printButton = document.getElementById("printCertificate");
  const gradeButton = form.querySelector('button[type="submit"]');
  let latestScore = 0;
  let questionOrder = data.questions.map((question, index) => index);

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
    questionOrder = shuffle(data.questions.map((question, index) => index));

    // Five questions use every answer position, with two positions used twice.
    // Shuffling this balanced set prevents a recognizable correct-answer pattern.
    const correctPositions = shuffle([0, 0, 1, 1, 2]);

    questionOrder.forEach((questionIndex, visibleIndex) => {
      const fieldset = fieldsets[questionIndex];
      const legend = fieldset.querySelector("legend");
      const labels = [...fieldset.querySelectorAll("label")];
      const correctValue = String(data.questions[questionIndex].answer);
      const correctLabel = labels.find(label =>
        label.querySelector("input")?.value === correctValue
      );
      const incorrectLabels = shuffle(labels.filter(label => label !== correctLabel));
      incorrectLabels.splice(correctPositions[visibleIndex], 0, correctLabel);

      legend.textContent = legend.textContent.replace(/^\d+\.\s*/, (visibleIndex + 1) + ". ");
      fieldset.dataset.visibleQuestion = String(visibleIndex + 1);
      incorrectLabels.forEach(label => fieldset.appendChild(label));
      form.insertBefore(fieldset, gradeButton);
    });
  }

  randomizeQuiz();

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

  form.addEventListener("submit", event => {
    event.preventDefault();
    const answers = data.questions.map((question, index) => {
      const selected = form.querySelector('input[name="question-' + index + '"]:checked');
      return selected ? Number(selected.value) : null;
    });
    const firstMissing = questionOrder.find(questionIndex => answers[questionIndex] === null);
    if (firstMissing !== undefined) {
      const missingFieldset = form.querySelector('input[name="question-' + firstMissing + '"]')?.closest("fieldset");
      const visibleQuestion = missingFieldset?.dataset.visibleQuestion || String(questionOrder.indexOf(firstMissing) + 1);
      status.textContent = "Answer every question before grading. Question " + visibleQuestion + " is not answered.";
      missingFieldset?.querySelector("input")?.focus();
      return;
    }

    const correct = answers.reduce((total, answer, index) => total + (answer === data.questions[index].answer ? 1 : 0), 0);
    latestScore = Math.round((correct / data.questions.length) * 100);
    const passed = latestScore >= data.passPercent;
    status.innerHTML = "";
    const heading = document.createElement("h3");
    heading.tabIndex = -1;
    heading.textContent = passed
      ? "Passed: " + correct + " of " + data.questions.length + " correct, " + latestScore + " percent."
      : "Not passed yet: " + correct + " of " + data.questions.length + " correct, " + latestScore + " percent.";
    const note = document.createElement("p");
    note.textContent = passed
      ? "You may create your course-completion certificate below."
      : "Review the answer explanations and lessons, then retake the quiz. Four correct answers are required.";
    status.append(heading, note);
    heading.focus();

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
      result.innerHTML = "<strong>" + (isCorrect ? "Correct." : "Incorrect.") + "</strong> Correct answer: ";
      result.append(document.createTextNode(question.options[question.answer]));
      explanation.textContent = question.explanation;
      item.append(result, explanation);
      list.appendChild(item);
    });
    review.append(reviewHeading, list);

    setup.hidden = !passed;
    certificate.hidden = true;
    if (passed) {
      saveResult(latestScore);
      document.getElementById("certificate-setup-heading").focus?.();
      nameInput.focus();
    }
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
    document.getElementById("certificateDate").textContent = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" }).format(new Date());
    certificate.hidden = false;
    certificateStatus.textContent = "Certificate created. The name remains only on this page.";
    document.getElementById("certificate-heading").tabIndex = -1;
    document.getElementById("certificate-heading").focus();
  });

  printButton.addEventListener("click", () => {
    document.body.classList.add("print-certificate");
    window.print();
  });
  window.addEventListener("afterprint", () => document.body.classList.remove("print-certificate"));
})();
