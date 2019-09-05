const mongoose = require('mongoose');

mongoose
    .connect(process.env.DATABASE_URL, { useNewUrlParser: true })
    .catch(error => handleError(error));

mongoose.set('useCreateIndex', true);

module.exports = mongoose;
