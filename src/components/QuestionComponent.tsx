import React from "react";

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
    <div>
      <div>
        Question: {questionNo} / {totalQuestions}
      </div>
      <div dangerouslySetInnerHTML={{ __html: question }} />
      <div>
        {answers.map((answer, key) => (
          <div key={key}>
            <button disabled={userAns} value={answer} onClick={callback}>
              <span dangerouslySetInnerHTML={{ __html: answer }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
