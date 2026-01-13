const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const url = process.env.MONGODB_URL;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 })
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch(error => {
        console.log('error connecting to to MongoDB:', error.message)
    })

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    },
});

module.exports = mongoose.model("Person", personSchema);

/* const person = new Person({
    name: name,
    number: num,
});

if (num === undefined) {
    Person.find({}).then((result) => {
        console.log("phonebook:")
        result.forEach((p) => {
            console.log(`${p.name} ${p.number}`);
        });
        mongoose.connection.close();
    });
} else {
    person.save().then((result) => {
        console.log(`added ${name} number ${num} to phonebook`);
        mongoose.connection.close();
    });
}

 */