const express = require('express');
const PORT = process.env.PORT || 3001;
const { animals } = require('./data/animals');
const fs = require('fs');
const path =  require('path');
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());
// Make linked files/ assets (i.e. css, js scripts, etc.) available when loading the html in the browser (this illiminates the need for individual GET requests.)
app.use(express.static('public'));
// Both of the above middleware functions need to be set up every time you create a server that's looking to accept POST data.

function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    if (query.personalityTraits) {
        if (typeof query.personalityTraits === 'string') {
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        }
        personalityTraitsArray.forEach(trait => {
            filteredResults = filteredResults.filter(
                animal => animal.personalityTraits.indexOf(trait) !== -1
                );
            });
        }
        if (query.diet) {
            filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
        }
        if (query.species) {
            filteredResults = filteredResults.filter(animal => animal.species === query.species);
        }
        if (query.name) {
            filteredResults = filteredResults.filter(animal => animal.name === query.name);
        }
        return filteredResults;
    }
    
    function findById(id, animalsArray) {
        const result = animalsArray.filter(animal => animal.id === id)[0];
        return result;
    }

    function createNewAnimal(body, animalsArray) {
        const animal = body;
        animalsArray.push(animal);
        fs.writeFileSync(
            path.join(__dirname, './data/animals.json'),
            JSON.stringify({ animals: animalsArray }, null, 2)
        );
        return animal;
    }

    function validateAnimal(animal) {
        if (!animal.name || typeof animal.name !== 'string') {
            return false;
        }
        if (!animal.species || typeof animal.species !== 'string') {
            return false;
        }
        if (!animal.diet || typeof animal.diet !== 'string') {
            return false;
        }
        if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
            return false;
        }
        return true;
    }

    app.get('/api/animals', (req, res) => {
        let results = animals;
        if (req.query) {
            results = filterByQuery(req.query, results);
        }
        console.log(req.query)
        res.json(results);
    });

    app.get('/api/animals/:id', (req, res) => {
        const result = findById(req.params.id, animals);
        if (result) {
            res.json(result);
        } else {
            res.send(404)
        }
    });
    
    app.post('/api/animals', (req, res) => {
        req.body.id = animals.length.toString();
        if (!validateAnimal(req.body)) {
            res.status(400).send('The animal is not properly formatted.');
        } else {
            const animal = createNewAnimal(req.body, animals);
            res.json(animal);
        }
    });

    // Copy the .html file from ./public/index.html and paste it in a new HTML page at thhe root of the folder using 
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname, './public/index.html'));
    });

    app.listen(PORT, () => {
        console.log(`API server now on port ${PORT}!`);
    });
    

    // Questions for Chandler:
    // explain path.join
    // does res.sendFile mean that we are copying info and pasting it into a new file?
    // Explain the concept/ meaning/ purpose of middleware
    // Explain what a static file is
    // IS "else"always needed when writting if/ else statements (refer to script.js line 40-41)
    // What is the benifit of using fetch() method: GET/ POST and using just GET or POST (refer to 11.3.5 module "Use Fetch API to POST Data" section)

