import React, { useState } from "react";
import { QuestionComponent } from "./components/QuestionComponent";

import { Difficulty, QuestionState, fetchQuestions } from "./API";

const TOTAL_QUESTIONS = 10;

type AnsObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

function App() {
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [currentQuestionNo, setCurrentQuestionNo] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnsObject[]>([]);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(true);

  const startQuiz = async () => {
    setLoading(true);
    setOver(false);
    const newQuestions = await fetchQuestions(TOTAL_QUESTIONS, Difficulty.EASY);
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setCurrentQuestionNo(0);
    setLoading(false);
  };
  const nextQuestion = async () => {
    const nextQuestion = currentQuestionNo + 1;
    if (nextQuestion === TOTAL_QUESTIONS) {
      setOver(true);
    } else {
      setCurrentQuestionNo(nextQuestion);
    }
  };
  const ansSelect = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!over) {
      const answer = e.currentTarget.value;
      const correct = questions[currentQuestionNo].correct_answer === answer;
      if (correct) setScore((prev) => prev + 1);
      const answerObj = {
        question: questions[currentQuestionNo].question,
        answer,
        correct,
        correctAnswer: questions[currentQuestionNo].correct_answer,
      };
      setUserAnswers((prev) => [...prev, answerObj]);
    }
  };

  return (
    <div>
      <h1>Quid</h1>
      {over || userAnswers.length === TOTAL_QUESTIONS ? (
        <button onClick={startQuiz}>Start</button>
      ) : null}
      {!over ? <div>Score: {score}</div> : null}
      {loading ? <div>Loading...</div> : null}
      {!loading && !over ? (
        <QuestionComponent
          questionNo={currentQuestionNo + 1}
          totalQuestions={TOTAL_QUESTIONS}
          question={questions[currentQuestionNo].question}
          answers={questions[currentQuestionNo].answers}
          userAns={userAnswers ? userAnswers[currentQuestionNo] : undefined}
          callback={ansSelect}
        />
      ) : null}
      {!over &&
      !loading &&
      userAnswers.length === currentQuestionNo + 1 &&
      currentQuestionNo !== TOTAL_QUESTIONS - 1 ? (
        <button onClick={nextQuestion}>Next</button>
      ) : null}
    </div>
  );
}

export default App;
