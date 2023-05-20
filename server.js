const mongoose = require('mongoose');

const app = require('./app');

const DB_HOST =
  "mongodb+srv://Olga:9DPLeBoUCBMitEQV@cluster0.xp7u4rd.mongodb.net/contacts_reader?retryWrites=true&w=majority";

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000)
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  });
