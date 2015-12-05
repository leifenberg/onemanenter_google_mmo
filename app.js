var config = require( './config.js' ),
	express = require('express'),
	app = express(),
	router = express.Router(),
	session = require( 'express-session' ),
	http = require('http').Server(app),
	redis = require( 'redis' ),
	RedisStore = require( 'connect-redis' )( session ),
	client = redis.createClient(),
	sessionStore = new RedisStore({
		host : 'localhost',
		port : 6739,
		client : client,
		ttl : config.sessionNumberOfSeconds
	} );
	websocket = require( './websocket/websocket.js' )( http , sessionStore , session ),
	passport = require( './auth/auth.js' ),
	bodyParser = require( 'body-parser' ),
	passportSocketIo = require( 'passport.socketio' );


app.use( bodyParser.urlencoded( { extended : true , limit : '100mb', parameterLimit: 10000} ) );
app.use( bodyParser.json({ limit : '100mb' ,parameterLimit: 10000}) );

app.use( session( {
	store : sessionStore,
	secret: config.sessionSecret,
    resave: false,
	saveUninitialized: false 
} ) );
app.use( passport.initialize() );
app.use( passport.session() );



app.use( '/api' , require( './api/router.js' )( router , sessionStore ) );

app.use( "/public" , express.static( __dirname + '/public' ));

app.use( "/tests" , express.static( __dirname + '/tests' ));

http.listen( config.port , function(){
	console.log('listening on *:' , config.port );
});

