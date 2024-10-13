import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timer, setTimer] = useState(30);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Function to fetch questions with retry logic
  const fetchQuestionsWithRetry = async (retryCount = 3) => {
    let retries = 0;
    while (retries < retryCount) {
      try {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=27&difficulty=easy&type=multiple');
        if (!response.ok) {
          if (response.status === 429) {
            // Jika status 429, tunggu sebelum melakukan retry
            const retryAfter = 1000; // 1 detik
            console.log(`Rate limit hit. Retrying after ${retryAfter / 1000} seconds...`);
            await new Promise(resolve => setTimeout(resolve, retryAfter));
            retries += 1;
          } else {
            throw new Error('Failed to fetch questions');
          }
        } else {
          const data = await response.json();
          console.log(data.results); // Debugging line to check the fetched data
          if (data.results.length > 0) {
            sessionStorage.setItem('quizQuestions', JSON.stringify(data.results)); // Simpan data di sessionStorage
            return data.results;
          } else {
            throw new Error('No questions available');
          }
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }
    throw new Error('Failed to fetch after multiple retries');
  };

  // Handle when the user proceeds to the next question
  const handleNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimer(30); // Reset timer for the next question
    } else {
      // Navigate to result page when quiz is over
      navigate('/result', { state: { answers, questions } });
    }
  }, [currentQuestionIndex, questions.length, answers, navigate]);

  // Timer logic
  useEffect(() => {
    if (questions.length > 0) {
      const interval = setInterval(() => {
        if (timer > 0) {
          setTimer(timer - 1);
        } else {
          handleNextQuestion();
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, questions, handleNextQuestion]);

  // Fetch questions when the component mounts
  useEffect(() => {
    const cachedQuestions = sessionStorage.getItem('quizQuestions');
    if (cachedQuestions) {
      setQuestions(JSON.parse(cachedQuestions));
      setLoading(false);
    } else {
      fetchQuestionsWithRetry()
        .then(data => {
          setQuestions(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, []);

  // Handle user answer selection
  const handleAnswer = (answer) => {
    setAnswers([...answers, answer]);
    handleNextQuestion();
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (questions.length === 0) {
    return <p>No questions available.</p>;
  }

  return (
    <div className="quiz-container">
      {questions.length > 0 && (
        <div>
          <h2 className="question">{questions[currentQuestionIndex].question}</h2>
          {questions[currentQuestionIndex].incorrect_answers.concat(questions[currentQuestionIndex].correct_answer).map((answer, idx) => (
            <button key={idx} onClick={() => handleAnswer(answer)}>{answer}</button>
          ))}
        </div>
      )}
      <p className="timer">Time left: {timer} seconds</p>
    </div>
  );
}

export default Quiz;
