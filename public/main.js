(() => {
  
  const QUIZ_API = 'https://opentdb.com/api.php?amount=10&type=multiple';

  // QUIZの状態
  const quizState = {
    quizzes : [],
    currentIndex : 0,
    numberOfCorrects : 0
  };

  // HTMLのid値がセットされているDOMを取得
  const titleElement = document.getElementById('title');
  const genreElement = document.getElementById('genre');
  const difficultyElement = document.getElementById('difficulty');
  const questionElement = document.getElementById('question');
  const answersContainer = document.getElementById('answers');

  // ページの読み込みが完了したらクイズ情報を取得
  window.addEventListener('load', (event) => {
    fetchQuizData();
  });

  // クイズデータを取得し、クイズを表示させる
  const fetchQuizData = async () => {
    titleElement.textContent = '取得中'
    questionElement.textContent = '少々お待ちください';

    try {
      const response = await fetch(QUIZ_API);
      const data = await response.json();
      console.log(data.results);
      quizState.quizzes = data.results;
      quizState.currentIndex = 0;
      quizState.numberOfCorrects = 0;
      setNextQuiz();
    } catch (error) {
      alert(`読み込み失敗... (${error.message})`);
    }
  };

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
  };

  // 選択肢クリア
  const removeAllAnswers = () => {
    while (answersContainer.firstChild) {
      answersContainer.removeChild( answersContainer.firstChild );
    }
  };

  // クイズの生成
  const makeQuiz = (quiz) => {
    const answers = buildAnswers(quiz);

    // クイズ情報をセット
    titleElement.textContent = `問題${quizState.currentIndex + 1}`
    genreElement.textContent = `【ジャンル】${quiz.category}`
    difficultyElement.textContent = `【難易度】${quiz.difficulty}`
    questionElement.textContent = unescapeHTML(quiz.question);

    // 解答選択肢をセット
    answers.forEach((answer) => {
      const liElement = document.createElement('li');
      const buttonElement = document.createElement('button')
      buttonElement.textContent = unescapeHTML(answer);
      answersContainer.appendChild(liElement).appendChild(buttonElement);

      // 解答を選択したときの処理
      liElement.addEventListener('click', (event) => {
        unescapedCorrectAnswer = unescapeHTML(quiz.correct_answer);
        if (event.target.textContent === unescapedCorrectAnswer) {
          quizState.numberOfCorrects++;
        } else {
        }

        quizState.currentIndex++;
        setNextQuiz();
      });
    });
  };

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

  // クイズの中にエスケープ文字列があるため対応
  const unescapeHTML = (str) => {
    var div = document.createElement("div");
    div.innerHTML = str.replace(/</g,"&lt;")
                      .replace(/>/g,"&gt;")
                      .replace(/ /g, "&nbsp;")
                      .replace(/\r/g, "&#13;")
                      .replace(/\n/g, "&#10;");

    return div.textContent || div.innerText;
  };
})();
