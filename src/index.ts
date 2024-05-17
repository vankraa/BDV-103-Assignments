import zodRouter from 'koa-zod-router';
import getBooks from './get-books';
const Koa = require('koa');
const cors = require('@koa/cors');

const router = zodRouter();
router.register(getBooks.getBooksRoute);

const app = new Koa();
app.use(cors());
app.use(router.routes());
require('koa-qs')(app)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});