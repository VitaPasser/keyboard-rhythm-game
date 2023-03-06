const express = require("express");
const app = express();

app.use(express.static('app'));

const server = app.listen(3000, function() {
    console.log('working on', server.address().port);
});