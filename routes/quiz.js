const express = require('express');
const router = express.Router();
const fetch = require('node-fetch');

router.get('/', async (req, res, next) => {
  // QUIZオブジェクトの取得
  const QUIZ_API = 'https://opentdb.com/api.php?amount=10&type=multiple';

  try {
    const response = await fetch(QUIZ_API);
    const data = await response.json();
    const quizzes = JSON.parse(JSON.stringify(data.results));
    console.log(quizzes[0]);
    quizzes.map (
      quiz => {
        const answers = buildAnswers(quiz);
        quiz.answers = answers;
      }
    );
    res.header('Content-Type', 'application/json; charset=urf-8');
    res.send(quizzes);
  } catch (error) {
    next(error);
  }
});

  // シャッフル済みの解答一覧を取得する
  const buildAnswers = (quiz) => {
    const answers = [
      quiz.correct_answer,
      ...quiz.incorrect_answers
    ];

    const shuffledAnswers = shuffle(answers);

    return shuffledAnswers;
  };

  // 解答をシャッフル
  const shuffle = (array) => {
    const copiedArray = array.slice();
    for (let i = copiedArray.length - 1; i >= 0; i--){
      const rand = Math.floor( Math.random() * ( i + 1 ) );
      [copiedArray[i], copiedArray[rand]] = [copiedArray[rand], copiedArray[i]]
    }

    return copiedArray;
  };

module.exports = router;
