require('dotenv').config()
const express = require("express");
const app = express();
const morgan = require("morgan");
const Person = require('./models/person')

app.use(express.static("dist"));
app.use(express.json());

morgan.token("data-sent", (req, res) => JSON.stringify(req.body));
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms :data-sent"
    )
);

app.get("/api/persons", (req, res) => {
    Person.find({}).then((p) => {
        res.json(p);
    });
});

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id).then(p => {
        if (p) {
            res.json(p)
        } else {
            res.status(404).end()
        }
    })
    .catch(err => next(err))
});

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(err => next(err))
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    const person = new Person({
        name: body.name,
        number: body.number,
    })

    person.save().then(savedPerson => {
        res.json(savedPerson)
    })
});

app.put('api/persons/:id', (req, res, next) => {
    const { name, number } = req.body

    Person.findById(req.params.id)
        .then(p => {
            if (!p) {
                return res.status(404).end()
            }

            p.name = name
            p.number = number

            return p.save().then(updatedPerson => {
                res.json(updatedPerson)
            })
        })
        .catch(err => next(error))
});

const errorHandler = (err, req, res, next) => {
    console.error(err.message)

    if (err.name === 'CastError') {
        return res.status(400).send({ error: 'malformatted id' })
    }

    next(err)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
