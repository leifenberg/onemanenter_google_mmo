var express = require( 'express' ),
	router = express.Router();

module.exports = function( router , sessionStore){
	require( './login.js' )( router , sessionStore );

	return router;
};
