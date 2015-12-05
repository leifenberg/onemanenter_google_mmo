var config = require( '../config.js' ),
	passport = require( '../auth/auth.js' ),
	redis = require( 'redis' ),
	utils = require( './utils.js' );

module.exports = function( router , sessionStore ){
	var tempUserSessionId = Math.random();

	var client = redis.createClient(),
		getUserData = function( user , callback ){
			callback( null , user , tempUserSessionId );
		},
		updateLastSession = function( user , lastSessionId , callback ){
			tempUserSessionId = lastSessionId;
			callback();
		},
		processPost = function( req , res , next  ){
			passport.authenticate('local', function(err, user, info) {
				if (err) { return next(err); }
				if (!user) {
					//req.session.passport.user = undefined;
					req.session.destroy();
					res.status( 403 );
					return res.send("<error>forbidden</error>" ); 
				}
				req.logIn(user, function(err) {
					console.log( req.session.passport );
					if (err) { return next(err); }
					res.send("logged");
					/*getUserData( user , function( err , guid , lastSessionId ){
						if( err !== null || guid === undefined ){
							res.status( 500 );
							return res.send( "<error>user corrupt</error>" );
						} else{
							if( req.sessionID !== lastSessionId ){
								console.log( "last:" , lastSessionId , "current:" , req.sessionID );
								updateLastSession( user , req.sessionID , function(){
									console.log( req.session.passport );
									//sessionStore.destroy( lastSessionId   );
								} );
							}
						}
					} );*/
				});
			})(req, res, next);
		},
		validateLoggedIn  = function( req , res , next ){
			console.log( req.session.passport );
			passport.validateUser( req , res , function(){
				res.send( "logged in" );
			} );
		},
		logout = function( req , res , next ){
			console.log( req.sessionID );
			//req.session.destroy();
			sessionStore.destroy( req.sessionID );
			res.send( "logged out" );
		};
	
	router.get( "/logout" , logout );
	router.get( "/validateLogin" , validateLoggedIn );
	router.post( "/login" , processPost );
	router.get( "/login" , function( req , res ){
		console.log( "hit");
		res.send( "ok" );
	} );
};
