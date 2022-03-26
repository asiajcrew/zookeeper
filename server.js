const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');

// parse (interpereting data) incoming string or array data
app.use(express.urlencoded({ extended: true}));
// parse incoming JSON data
app.use(express.json());
// Make linked files/ assets (i.e. css, js scripts, etc.) available when loading the html in the browser (this illiminates the need for individual GET requests.)
app.use(express.static('public'));
// All of the above middleware functions need to be set up every time you code with express.js
app.use('/api', apiRoutes);
app.use('/', htmlRoutes);

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});

// Questions for Chandler:
// explain path.join === concatenates the first parameter of the rout.get request with the seconf parameter of the path.join method
// does res.sendFile mean that we are copying info and pasting it into a new file (replacing/ overwritting whatever info was previously in that file) === yes!
// Explain the concept/ meaning/ purpose of middleware === a checkpoint to ensure data meets specific criteria
// Explain what a static file is === Files that are downloaded without modification (as it's being downloaded)
// Is "else" always needed when writting if/ else statements? === if there is a return statement after the "if" then there is no need for an "else"
// If I refactor my code by moving part of it to a new folder, what is the easiest way to check/ update all of my paths? (refer to 11.4.3 module) === instead of writting the code in one file then moving it, just start by writting the routes in the correct folder.
// How do you determine how to name the module.exports? === name the module.export by the name of the function that you want to send out
