const express = require('express');
const fs = require('fs');

const app = express();
const port = 3000;
const loggerMiddleware = (req, res, next) => {

    const timestamp = new Date().toISOString();
    const log = `[${timestamp}] ${req.method} ${req.url}\n`;
    fs.appendFile('requests.log', log, (err) => {
        if (err) {
            console.log("Error writing log");}
    });
    console.log(log);
    next(); 
};
app.use(loggerMiddleware);
app.get('/', (req, res) => {
    res.json({message: "Home Route"});
});
app.get('/about', (req, res) => {
    res.json({message: "About Route"});
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
