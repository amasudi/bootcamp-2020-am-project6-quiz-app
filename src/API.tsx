import { shuffleArray } from "./utilities";

export const fetchCategories = async () => {
  const ep = `https://opentdb.com/api_category.php`;
  const dt = await (await fetch(ep)).json();
  return dt.trivia_categories;
};

export const fetchQuestions = async (
  amount: number,
  difficulty: string,
  category: number
) => {
  const endpoint = `https://opentdb.com/api.php?category=${category}&amount=${amount}&difficulty=${difficulty}&type=multiple`;
  const data = await (await fetch(endpoint)).json();
  return data.results.map((question: Question) => ({
    ...question,
    answers: shuffleArray([
      ...question.incorrect_answers,
      question.correct_answer,
    ]),
  }));
};

export type Category = {
  id: number;
  name: string;
};

export type Question = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

export type QuestionState = Question & { answers: string[] };
