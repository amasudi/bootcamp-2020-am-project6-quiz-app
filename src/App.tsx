import React, { useState, useEffect } from "react";
import { QuestionComponent } from "./components/QuestionComponent";
import { GlobalStyle, Wrapper } from "./App.styles";

import {
  QuestionState,
  fetchQuestions,
  fetchCategories,
  Category,
} from "./API";

type AnsObject = {
  question: string;
  answer: string;
  correct: boolean;
  correctAnswer: string;
};

function App() {
  const [catLoading, setCatLoading] = useState(true);
  const [category, setCategory] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionState[]>([]);
  const [currentQuestionNo, setCurrentQuestionNo] = useState(0);
  const [userAnswers, setUserAnswers] = useState<AnsObject[]>([]);
  const [score, setScore] = useState(0);
  const [over, setOver] = useState(true);
  const [totalQuestions, setTotalQuestions] = useState(5);
  const [difficulty, setDifficulty] = useState("easy");

  useEffect(() => {
    const loadCats = async () => {
      setCatLoading(true);
      const cats = await fetchCategories();
      setCategories(cats);
      setCatLoading(false);
    };
    loadCats();
  }, []);
  const startQuiz = async () => {
    setLoading(true);
    setOver(false);
    const newQuestions = await fetchQuestions(
      totalQuestions,
      difficulty,
      category
    );
    setQuestions(newQuestions);
    setScore(0);
    setUserAnswers([]);
    setCurrentQuestionNo(0);
    setLoading(false);
  };
  const nextQuestion = async () => {
    const nextQuestion = currentQuestionNo + 1;
    if (nextQuestion === totalQuestions) {
      setQuestions([]);
      setCurrentQuestionNo(0);
      setCategory(0);
      setUserAnswers([]);
      setScore(0);
      setTotalQuestions(5);
      setDifficulty("easy");
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
    <>
      <GlobalStyle />
      <Wrapper>
        <h1>QUIZ</h1>
        {over || userAnswers.length === totalQuestions ? (
          catLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="body-wrapper">
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setTotalQuestions(Number(e.currentTarget.value));
                  if (!over) {
                    setOver(true);
                  }
                }}
              >
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="15">15</option>
                <option value="20">20</option>
                <option value="25">25</option>
              </select>
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setDifficulty(e.currentTarget.value);
                }}
              >
                <option value="easy">EASY</option>
                <option value="medium">MEDIUM</option>
                <option value="hard">HARD</option>
              </select>
              <select
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                  setCategory(Number(e.currentTarget.value));
                }}
              >
                <option value="0">---Mixed Categories---</option>
                {categories.map((cat: Category) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
              <button className="start" onClick={startQuiz}>
                Start
              </button>
            </div>
          )
        ) : null}
        {!over ? <div className="score">Score: {score}</div> : null}
        {loading ? <div>Loading...</div> : null}
        {!loading && !over ? (
          <QuestionComponent
            questionNo={currentQuestionNo + 1}
            totalQuestions={totalQuestions}
            question={questions[currentQuestionNo].question}
            answers={questions[currentQuestionNo].answers}
            userAns={userAnswers ? userAnswers[currentQuestionNo] : undefined}
            callback={ansSelect}
          />
        ) : null}
        {!over &&
        !loading &&
        userAnswers.length === currentQuestionNo + 1 &&
        currentQuestionNo !== totalQuestions - 1 ? (
          <button className="next" onClick={nextQuestion}>
            Next
          </button>
        ) : null}
      </Wrapper>
    </>
  );
}

export default App;
