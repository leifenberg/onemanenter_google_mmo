var passport = require( '../auth/auth.js' ),
	config = require( '../config.js' );

module.exports = {
	validateUser : function( processFunction ){
		return function( req , res  , next){
			passport.validateUser( req , res , function( req , res ){
				if( processFunction !== undefined ){
					processFunction( req , res , next );
				} else{
					next();
				}
			} );
		};
	},
	beforeGet : function( req , res , next ){ 
		if( req.query.select === "guid" ){
			req.body.select = "_id";
		}
		if( req.query.guid !== undefined ){
			req.query._id = req.query.guid;
		}
		next();
	},
	getJsonToXMLFunction : function( api , singleItemJsonToXMLFunction ){
		return function( req , res ){
			res.set('Content-Type', 'application/xml');
			if( res.locals.bundle === null ||
				res.locals.status_code == '500' ){
				res.send( "<error>Item doesnt exist</error>" );
			} else if( res.locals.bundle.length !== undefined ){
				var arr = "";
				arr += "<?xml version='1.0' encoding='UTF-8'?>";
				arr += "<" + api + "s>";
				for( var i = 0 ; i < res.locals.bundle.length ; i++ ){
					var apiItem = res.locals.bundle[ i ];
					arr += singleItemJsonToXMLFunction( apiItem );
				}
				arr += "</" + api + "s>";
				res.send( arr );
			} else{
				res.send( singleItemJsonToXMLFunction( res.locals.bundle ) );
			}
		};
	}
};
