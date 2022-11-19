const fetchQuiz = () => {
  // HTMLのid値がセットされているDOMを取得
  const titleElement = document.getElementById('title');
  const genreElement = document.getElementById('genre');
  const difficultyElement = document.getElementById('difficulty');
  const questionElement = document.getElementById('question');
  const answersContainer = document.getElementById('answers');
  const startButton = document.getElementById('start-button');

  // QUIZの状態
  const quizState = {
    quizzes : [],
    currentIndex : 0,
    numberOfCorrects : 0
  };


  fetch('/quiz')
    .then(res => res.json())
    .then(data => {
      startButton.remove();
      titleElement.textContent = '取得中'
      questionElement.textContent = '少々お待ちください';

      quizState.quizzes = data;
      quizState.currentIndex = 0;
      quizState.numberOfCorrects = 0;
      setNextQuiz();
    });

  // クイズを表示する処理
  const setNextQuiz = () => {
    // 問題文と解答を削除後、次の問題 or 結果を表示
    questionElement.textContent = '';
    removeAllAnswers();

    if (quizState.currentIndex < quizState.quizzes.length ) {
      const quiz = quizState.quizzes[quizState.currentIndex];
      makeQuiz(quiz);
    } else {
      finishQuiz();
    }
  };

  // 結果表示
  const finishQuiz = () => {
    titleElement.textContent = `あなたの正答数は${quizState.numberOfCorrects}です！！`;
    questionElement.textContent = '再度チャレンジしたい場合は以下をクリック！！';
    genreElement.hidden = true;
    difficultyElement.hidden = true;
    createRestartButton();
  };

  // 選択肢クリア
  const removeAllAnswers = () => {
    while (answersContainer.firstChild) {
      answersContainer.removeChild( answersContainer.firstChild );
    }
  };

  // クイズの生成
  const makeQuiz = (quiz) => {
    // クイズ情報をセット
    titleElement.textContent = `問題${quizState.currentIndex + 1}`
    genreElement.textContent = `【ジャンル】${quiz.category}`
    difficultyElement.textContent = `【難易度】${quiz.difficulty}`
    questionElement.textContent = unescapeHTML(quiz.question);

    // 解答選択肢をセット
    quiz.answers.forEach((answer) => {
      const liElement = document.createElement('li');
      const buttonElement = document.createElement('button')
      buttonElement.textContent = unescapeHTML(answer);
      answersContainer.appendChild(liElement).appendChild(buttonElement);

      // 解答を選択したときの処理
      liElement.addEventListener('click', (event) => {
        unescapedCorrectAnswer = unescapeHTML(quiz.correct_answer);
        if (event.target.textContent === unescapedCorrectAnswer) {
          quizState.numberOfCorrects++;
        }
        quizState.currentIndex++;
        setNextQuiz();
      });
    });
  };


  // クイズの中にエスケープ文字列があるため対応
  const unescapeHTML = (str) => {
    const div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
                      .replace(/>/g,"&gt;")
                      .replace(/ /g, "&nbsp;")
                      .replace(/\r/g, "&#13;")
                      .replace(/\n/g, "&#10;");

    return div.textContent || div.innerText;
  };

  const createRestartButton = () => {
    const restartButton = document.createElement("button");
    restartButton.textContent = "ホームに戻る"
    restartButton.setAttribute('onclick', 'window.location.reload();');
    const targetElement = document.getElementById("restart-button");
    targetElement.appendChild(restartButton);
  }
}
