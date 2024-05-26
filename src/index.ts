import zodRouter from 'koa-zod-router';
import getBooks from './get-books';
import modifyBooks from './modify-books';
import Koa from 'koa';
const app = new Koa();
const cors = require('@koa/cors');
app.use(cors());
require('koa-qs')(app)

const router = zodRouter();
router.register(getBooks.getBooksRoute);
router.register(modifyBooks.createOrUpdateBookRoute);
router.register(modifyBooks.deleteBookRoute);
app.use(router.routes());

const mongoose = require('mongoose');

// MongoDB connection URI
const mongoURI = 'mongodb://mongo:27017/mydatabase'; // "mongo" is the service name specified in docker-compose.yml

// Connect to MongoDB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err: Error) => console.error('MongoDB connection error:', err));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});