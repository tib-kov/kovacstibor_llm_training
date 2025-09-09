const express = require('express');
const path = require('path');
const app = express();
const port = 4200;

// Serve static files from the Angular app build directory
app.use(express.static(path.join(__dirname, '../dist/market-app/browser')));

// Catch all handler: send back Angular's index.html file for any non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/market-app/browser/index.csr.html'));
});

app.listen(port, () => {
    console.log(`SPA server running on http://localhost:${port}`);
    console.log('All routes will serve the Angular application');
});
