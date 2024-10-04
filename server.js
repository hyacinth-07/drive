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
const auth = require('./authentication/auth');
// RENDER ENGINE
app.set('views', './views');
app.set('view engine', 'ejs');

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

// login

passport.use(
	new LocalStrategy(async (username, password, done) => {
		try {
			auth.loginUser(username, password, done);
		} catch (err) {
			return done(err);
		}
	})
);

// serialize/deserialize

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
	try {
		auth.deserializeUser(id, done);
	} catch (err) {
		done(err);
	}
});

// authenticate

app.post(
	'/log-in',
	passport.authenticate('local', {
		successRedirect: '/',
		failureRedirect: '/log-in',
	})
);

/////////// ROUTES ///////////
const routes = require('./routes/driveRoutes');
app.use(routes);

app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
