const express = require('express');
const bodyParser = require('body-parser');
const driveRoutes = require('./routes');

const app = express();

app.use(bodyParser.json()); // Parses incoming JSON requests.
app.use('/drive', driveRoutes); // Mounts the driveRoutes on the /drive path.

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
