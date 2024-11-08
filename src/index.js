require('dotenv').config();
const cors = require('cors');
const express = require('express');
const morgan = require('morgan');
const app = express();
const Person = require('./models/person.js');
const PORT = process.env.PORT || 3001;

morgan.token('post_content', function (req, res) { return req.method == 'POST' ? JSON.stringify(req.body) : ' ' });
app.use(morgan(':method :url :status :response-time - ms :post_content'));
app.use(cors());
app.use(express.static('dist'));
app.use(express.json());

app.get('/api/persons', (req, res, next) => {
  Person
    .find({})
    .then(persons => res.json(persons))
    .catch(error => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person
    .findById(id)
    .then(person => {
      if (person) {
        res.json(person);
      } else {
        res.status(404).send("<h1>404 Not Found</h1>").end();
      }
    })
    .catch(error => {
      next(error);
    });
});

app.delete('/api/persons/:id', (req, res, next) => {
  const id = req.params.id;
  Person
    .findByIdAndDelete(id)
    .then(result => res.status(204).send(`data has been deleted`))
    .catch(error => next(error));
});

app.get('/info', (req, res) => {
  Person
    .find({})
    .then(result => {
      res.send(`${result}`)
    })
  //res.send(
  //  `<p>Phonebook has info for ${persons.length} people.</p><br/>${new Date().toString()}`
  //)
});

app.post('/api/persons', (req, res, next) => {
  const name = req.body.name;
  const number = req.body.number;

  if (name == false || number == false) {
    return res
      .status(400)
      .send("<h1>The number needs to contain both phone and name.</h1>");
  } else {
    Person
      .find({name: name})
      .then(result => {
        if (result != null) {
          return res
            .status(400)
            .send(`<h1>The name ${name} is already in the list.</h1>`);
        } else {
          const person = new Person({
            name: name,
            number: number,
          });
          person
            .save()
            .then(result => res.send(`<h1>${name} is now in the list</h1>`))
            .catch(error => next(error));
        }
      })
      .catch(error => next(error));
    }
});

// unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' });
};

app.use(unknownEndpoint);

// error handling middleware
const errorHandler = (error, request, response, next) => {

  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  next(error);
}

app.use(errorHandler);

app.listen(PORT, () => `app is found on http://localhost:${PORT}`);
