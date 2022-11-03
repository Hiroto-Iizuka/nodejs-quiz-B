const express = require('express');
const indexRouter = require('./routes/index');
const quizRouter = require('./routes/quiz');

const app = express();
const PORT = 3001;

// app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/', indexRouter);
app.use('/quiz', quizRouter);

app.listen(PORT, () => {
  console.log(`Quiz app listening on port ${PORT}!`);
});
