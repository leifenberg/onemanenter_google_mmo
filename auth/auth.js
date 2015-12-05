//passport flow - http://toon.io/understanding-passportjs-authentication-flow/
//Text tutorial - http://scotch.io/collections/easy-node-authentication
//Video Tutorial - https://www.youtube.com/watch?v=FgdEHhUR3ag
//Video Totirial 2 - http://www.learnallthenodes.com/episodes/21-password-authentication-in-node-with-passport

var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	userPasswordStrategy = new LocalStrategy(
		{ usernameField : 'user' , passwordField : 'password' },
		function( username, pass, done) {
			if( username === "yaron" &&
				pass === "123" ){
					done( null , "yaron" );
				} else{
					done( null );
				}
		}
	);

passport.use( userPasswordStrategy );

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

//This is a middleware I created to use as a validator 
//before routes
passport.validateUser = function( req , res , next ){
	if( req.session.passport.user === undefined ){
		res.status( 403 )
		res.send( 'forbidden' );
	} else{
		next( req , res );
	}
};

module.exports = passport;

