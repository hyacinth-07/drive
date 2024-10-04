/////////// LIBRARIES ///////////

const express = require('express');
const app = express();
app.use(express.json());
// ENV
require('dotenv').config();
const port = process.env.PORT;
// AUTH
const session = require('express-session');
const { PrismaSessionStore } = require('@quixo3/prisma-session-store');
const { PrismaClient } = require('@prisma/client');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

/////////// AUTHENTICATION ///////////

app.use(
	session({
		cookie: {
			maxAge: 7 * 24 * 60 * 60 * 1000, // ms
		},
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
		store: new PrismaSessionStore(new PrismaClient(), {
			checkPeriod: 2 * 60 * 1000, //ms
			dbRecordIdIsSessionId: true,
			dbRecordIdFunction: undefined,
		}),
	})
);

app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

/////////// ROUTES ///////////
const routes = require('./routes/driveRoutes');
app.use(routes);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
