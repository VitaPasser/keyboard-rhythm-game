const express = require("express");
const app = express();

app.use(express.static('game'));
app.use(express.static('maps'));

const server = app.listen(3000, function() {
    console.log('working on', server.address().port);
});