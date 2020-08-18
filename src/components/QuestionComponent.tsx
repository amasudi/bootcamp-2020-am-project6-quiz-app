import React from "react";
import { Wrapper, ButtonWrapper } from "./QuestionComponent.styles";
type Props = {
  question: string;
  answers: string[];
  callback: any;
  userAns: any;
  questionNo: number;
  totalQuestions: number;
};

export const QuestionComponent: React.FC<Props> = ({
  question,
  answers,
  callback,
  userAns,
  questionNo,
  totalQuestions,
}) => {
  return (
    <Wrapper>
      <div>
        Question: {questionNo} / {totalQuestions}
      </div>
      <div dangerouslySetInnerHTML={{ __html: question }} />
      <div>
        {answers.map((answer, key) => (
          <ButtonWrapper
            correct={userAns?.correctAnswer === answer}
            userClicked={userAns?.answer === answer}
            key={key}
          >
            <button disabled={userAns} value={answer} onClick={callback}>
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </button>
          </ButtonWrapper>
        ))}
      </div>
    </Wrapper>
  );
};
