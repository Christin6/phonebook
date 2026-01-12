const express = require('express')
const app = express()
const morgan = require('morgan')

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
]

app.use(express.static('dist'))

app.use(express.json())

morgan.token('data-sent', (req, res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data-sent'))

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {
    const currentDate = new Date()
    
    res.send(`
        <p>phonebook has info for ${persons.length} people</p>
        <p>${currentDate}</p>
    `)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    persons = persons.filter((person) => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const maxId = persons.length > 0
        ? Math.max(...persons.map(p => Number(p.id)))
        : 0
    return String(maxId + 1)
}

app.post('/api/persons', (req, res) => {
    const person = req.body

    if (!person.name || !person.number) {
        return res.status(400).json({
            error: 'content missing'
        })
    } else if (persons.some((p) => p["name"] === person.name)) {
        return res.status(400).json({
            error: 'this person already exists'
        })
    }
    
    person.id = generateId()

    persons = persons.concat(person)
    
    res.json(person)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})