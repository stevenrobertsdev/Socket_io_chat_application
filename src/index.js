const   path = require('path'),
        express = require('express'),
        app = express(),
        port = process.env.PORT || 3000,
        publicDirectoryPath = path.join(__dirname, "../public");

app.use(express.static(publicDirectoryPath));

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})

