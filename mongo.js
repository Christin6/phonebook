const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log("give password as argument");
    process.exit(1);
}

const password = process.argv[2];
const name = process.argv[3];
const num = process.argv[4];

const url = `mongodb+srv://maricelchristina0409_db_user:${password}@cluster0.9agedk7.mongodb.net/?appName=Cluster0`;

mongoose.set("strictQuery", false);

mongoose.connect(url, { family: 4 });

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
});

const Person = mongoose.model("Person", personSchema);

const person = new Person({
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
