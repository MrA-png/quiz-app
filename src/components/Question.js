import React from 'react';

function Question({ question, onAnswer }) {
  const shuffledAnswers = [
    question.correct_answer,
    ...question.incorrect_answers
  ].sort(() => Math.random() - 0.5);

  return (
    <div>
      <h2>{question.question}</h2>
      {shuffledAnswers.map((answer, index) => (
        <button key={index} onClick={() => onAnswer(answer)}>
          {answer}
        </button>
      ))}
    </div>
  );
}

export default Question;
