import "./style.css";
import { Questions } from "./questions";

const TIMEOUT = 4000;

const app = document.querySelector("#app");

const startButton = document.querySelector("#start");

startButton.addEventListener("click", startQuizz);

function startQuizz(event) {
  console.log(event);
  let currentQuestion = 0;
  let score = 0;

  displayQuestion(currentQuestion);

  function clean() {
    while (app.firstElementChild) {
      app.firstElementChild.remove();
    }
    const progress = getProgressBar(currentQuestion, Questions.length);
    app.appendChild(progress);
  }

  function displayQuestion(index) {
    clean();
    const question = Questions[index];

    if (!question) {
      // Finish quizz
      displayFinishMessage(score);
      return;
    }

    const title = getTitleElement(question.question);
    app.appendChild(title);
    const answersDiv = createAnswers(question.answers);
    app.appendChild(answersDiv);

    const submitButton = getSubmitButton();
    submitButton.addEventListener("click", submit);

    app.appendChild(submitButton);
  }

  function submit() {
    const selectedAnswer = app.querySelector('input[name="answer"]:checked');
    const value = selectedAnswer.value;
    const question = Questions[currentQuestion];
    const isCorrect = question.correct === value;
    if (isCorrect) {
      score++;
    }
    showFeedBack(isCorrect, question.correct, value);
    const feedBack = getFeedBackMessage(isCorrect, question.correct);
    displayNextQuestionButton(() => {
      currentQuestion++;
      displayQuestion(currentQuestion);
    });
    app.appendChild(feedBack);
    desableAllAnswer();
  }
}

// ------------------Methodes---------------------
function displayNextQuestionButton(callback) {
  let remainingTimeout = TIMEOUT;

  document.querySelector("button").remove();

  const getButtonText = () => `Next (${remainingTimeout / 1000}s)`;

  const nextButton = document.createElement("button");
  nextButton.innerText = getButtonText();
  app.appendChild(nextButton);

  const interval = setInterval(() => {
    remainingTimeout -= 1000;
    nextButton.innerText = getButtonText();
  }, 1000);

  const timeout = setTimeout(() => {
    handleNextQuestion();
  }, TIMEOUT);

  const handleNextQuestion = () => {
    clearInterval(interval);
    clearTimeout(timeout);
    callback();
  };

  nextButton.addEventListener("click", () => {
    handleNextQuestion();
  });
}

function createAnswers(answers) {
  const answerDiv = document.createElement("div");

  answerDiv.classList.add("answers");

  for (const answer of answers) {
    const label = getAnswerElement(answer);
    answerDiv.appendChild(label);
  }
  return answerDiv;
}

function getTitleElement(text) {
  const title = document.createElement("h3");
  title.innerText = text;
  return title;
}

function formatId(text) {
  return text.replaceAll(" ", "-").replaceAll('"', "'").toLowerCase();
}

function getAnswerElement(answer) {
  const label = document.createElement("label");
  label.innerText = answer;
  const input = document.createElement("input");
  const id = formatId(answer);
  input.id = id;
  label.htmlFor = id;
  input.setAttribute("type", "radio");
  input.setAttribute("name", "answer");
  input.setAttribute("value", answer);

  label.appendChild(input);
  return label;
}

function getSubmitButton() {
  const submitButton = document.createElement("button");
  submitButton.innerText = "Submit";
  return submitButton;
}

function showFeedBack(isCorrect, correct, answer) {
  const correctAnswerId = formatId(correct);
  const correctElement = document.querySelector(
    `label[for="${correctAnswerId}"]`
  );

  const selectedAnswerId = formatId(answer);
  const selectedElement = document.querySelector(
    `label[for="${selectedAnswerId}"]`
  );
  correctElement.classList.add("correct");
  selectedElement.classList.add(isCorrect ? "correct" : "incorrect");
}

function getFeedBackMessage(isCorrect, correct) {
  const paragraph = document.createElement("p");
  paragraph.innerText = isCorrect
    ? "Bien joué, tu as eu la bonne réponse"
    : `Désolé... la bonne réponse était : ${correct}`;
  return paragraph;
}

function displayFinishMessage(score) {
  const h1 = document.createElement("h1");
  h1.innerText = "Bravo, tu as terminé le Quizz JS";
  const p = document.createElement("p");
  p.innerText = `ton score est de ${score} sur ${Questions.length} points`;
  app.appendChild(h1);
  app.appendChild(p);
}

function getProgressBar(value, max) {
  const progress = document.createElement("progress");
  progress.setAttribute("max", max);
  progress.setAttribute("value", value);
  return progress;
}

function desableAllAnswer() {
  const radioInputs = document.querySelectorAll('input[type="radio"]');
  console.log("radioInputs", radioInputs);
  for (const radio of radioInputs) {
    radio.disabled = true;
  }
}
