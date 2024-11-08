require('dotenv').config()
const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const app = express()
const Person = require('./mongo/models/person.js')
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.static('dist'))
app.use(express.json());
morgan.token('post_content', function (req, res) { return req.method == 'POST' ? JSON.stringify(req.body) : ' ' })
app.use(morgan(':method :url :status :response-time - ms :post_content'));

/*
let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]*/

function getRandomId(max = 10000000000000) {
  return Math.floor(Math.random() * max);
}

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => res.json(persons))
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id;
  Person.findById(id).then(person => res.json(person))
  /*
  if (person) {
    res.json(person)
  } else {
    res.status(404).send("<h1>404 Not Found</h1>")
  }*/
})
/*
app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  persons = persons.filter(person => person.id != id)
  res.status(204).send(`data has been deleted`);
})

app.get('/info', (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people.</p><br/>${new Date().toString()}`
  )
})
*/

app.post('/api/persons', (req, res) => {
  let person = {}
  person.name = req.body.name
  person.number = req.body.number

  if (person.name === undefined || person.number === undefined) {
    return res.status(400).send("<h1>The number needs to contain both phone and name.</h1>")
  }

  /*
  if (persons.find(p => p.name === person.name)) {
    return res.status(400).json({error: 'name must be unique'})
    //return res.status(400).send(`<h1>The name ${person.name} is already in the list.</h1>`)
  }
  */
  const p = new Person({
    name: person.name,
    number: person.number,
  }).save().then(result => res.send(`<h1>${person.name} is now in the list</h1>`))
})

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'unknown endpoint' })
}

// middleware
app.use(unknownEndpoint)

app.listen(PORT, () => `app is found on http://localhost:${PORT}`)
