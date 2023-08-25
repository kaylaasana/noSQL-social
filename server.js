// require express
const express = require('express');
// require connection.js
const db = require('./config/connection');
// require routes
const routes = require('./routes');
// create port 
const PORT = process.env.PORT || 3001;
const app = express();

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

// listen at port
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
