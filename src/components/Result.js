import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, questions } = location.state;

  const correctAnswers = questions.filter(
    (question, index) => question.correct_answer === answers[index]
  ).length;

  const username = sessionStorage.getItem('username') || 'User';

  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 30000);

    return () => clearTimeout(timer);
  }, []);

  const handleRestartQuiz = () => {
    navigate('/quiz');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('username');
    navigate('/'); 
  };

  return (
    <div>
      {showConfetti && <Confetti />}
      <h1>Quiz Result {username}!</h1>
      <p>Total Questions: {questions.length}</p>
      <p>Correct Answers: {correctAnswers}</p>
      <p>Wrong Answers: {questions.length - correctAnswers}</p>
      <button onClick={handleRestartQuiz}>Start Again</button>
      <button onClick={handleLogout} className="button-logout">Logout</button>
    </div>
  );
}

export default Result;