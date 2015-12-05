var config = require( '../config.js' ),
	passportSocketIo = require("passport.socketio");

module.exports = function( http , sessionStore , session ){
	var io = require('socket.io')(http),
		rooms,
		leaveCurrentRoom = function( socket ){
			if( socket.room !== undefined ){
				if( rooms[ socket.room ] === undefined || rooms[ socket.room ].players === undefined ){
					console.log( socket.room );
				} 
				for( var i = 0 ; i < rooms[ socket.room ].players.length ; i++ ){
					if( rooms[ socket.room ].players[i] === socket.guid ){
						rooms[ socket.room ].players.splice( i , 1 );
					}
				}
				socket.leave( socket.room );
				socket.emit( "bye" , socket.room );
				socket.broadcast.to( socket.room ).emit('left', socket.guid );
				delete socket.room;
			}
		},
		validateSession = function( socket ){
			sessionStore.get( socket.initialSessionId  , function( err , result ){
				if( result === undefined ){
					console.log( "Disconnecting" , socket.guid );
					socket.emit( "force disconnect" , "Same user connected on another device" );
					socket.disconnect();
					socket.conn.close();
				}
			} );
		},
		isPlayerRoom = function( name ){
			return false;
		};


	io.use( passportSocketIo.authorize({
		cookieParser : require( 'cookie-parser' ),
		secret : config.sessionSecret,
		store : sessionStore,
		success : function( data , accept ){
			sessionStore.get( data.sessionID , function( err , result ){
				console.log( "on successful login:" , result );
			} );
			accept();
		},
		fail : function( data , message , error , accept ){
			console.log( "Unauthorized user" );
		}
	} ) );

	io.on('connection', function(socket){
		console.log('a user connected');
		socket.initialSessionId = socket.request.sessionID;

		sessionStore.get( socket.initialSessionId , function( err , result ){
			//socket.realm = result.realm;
		} );

		socket.on('message', function(msg){
			validateSession( socket );
			io.sockets.in(socket.room).emit('message', socket.guid, msg);
		} );
		socket.on('disconnect', function(){
			console.log('user disconnected');
			leaveCurrentRoom( socket );
		//SHOULD BE AN ATOMIC "$INC" BUT AT THE TIME OR WRITING THIS CODE
		//COULD NOT MAKE IT WORK
		});
		socket.on( 'leave room' , function(){
			leaveCurrentRoom( socket );
		} );
		socket.on('request room' , function( roomId , TEMP_USER_GUID ){
			validateSession( socket );
			console.log( "room change to " , roomId );
			if( rooms[ roomId ] !== undefined || isPlayerRoom( roomId ) === true ){
				leaveCurrentRoom( socket );
				socket.guid = TEMP_USER_GUID;
				socket.room = roomId;
				socket.join( socket.room );
				socket.emit( 'welcome' , socket.room , rooms[ socket.room ].players.toString() );
				rooms[ socket.room ].players.push( socket.guid );
				socket.broadcast.to( socket.room ).emit('joined', socket.guid );
			} else
			{
				socket.emit( 'serverError' , 'Room:' + roomId + ' doesnt exist' );
			}
		} );
	});
};
