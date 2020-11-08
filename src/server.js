const app = require('./app');
// assign port based on env variable or default 8000
const { PORT } = require('./config');

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});