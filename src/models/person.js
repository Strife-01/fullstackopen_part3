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
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    minLength: 3,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d{3,}/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    required: true
  }
});

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  }
})

module.exports = mongoose.model('Person', personSchema);
