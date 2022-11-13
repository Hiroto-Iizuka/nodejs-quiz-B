const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const quizRouter = require('./routes/quiz');

const app = express();
const PORT = 3001;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/quiz', quizRouter);

app.listen(PORT, () => {
  console.log(`Quiz app listening on port ${PORT}!`);
});
