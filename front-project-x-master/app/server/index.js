const express = require('express');
const path = require('path');
const app = express();

// Define the port to run on
app.set('port', process.env.PORT || 9999);

const staticAssets = path.resolve(__dirname, '..', 'build');

app.use(express.static(staticAssets));

app.get('/*', function(req, res) {
    res.sendFile(path.join(staticAssets, 'index.html'));
});

// Listen for requests
const server = app.listen(app.get('port'), function() {
    const port = server.address().port;
    console.log(`listening on port ${port}`);
});
