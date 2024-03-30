import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');

app.get('/', async(req, res) => {
  res.send('Welcome to Gmail API with NodeJS');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
