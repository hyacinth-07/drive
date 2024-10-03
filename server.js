const express = require('express');
const app = express();
require('dotenv').config();
//
const port = process.env.PORT;

// ROUTES
const routes = require('./routes/driveRoutes');
app.use(routes);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
