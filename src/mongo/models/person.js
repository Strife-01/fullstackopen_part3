const mongoose = require('mongoose');

mongoose.set('strictQuery', false);

const url = process.env.MONGODB_URI;

console.log(`Connecting to ${url}`);

mongoose.connect(url)
.then(result => {
    console.log(`Connected to the database`);
})
.catch(error => {
  console.log(`Error message ${error.message}`);
});

const personSchema = new mongoose.Schema({
  name: String,
  phone: String,
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Person', personSchema);
