module.exports = {
	server : "dev.globo.co.il",
	port : "8080",
	dbHost : 'ds053214-a0.mongolab.com',
	dbName : 'globo_dev', 
	dbPort : '53214' ,
	dbUser : 'globoAdmin',
	dbPassword : 'globoAdmin15',
	assetBundlesCdn : "/public/cdn/",
	assetBundlesCdnOrigin : "/public/cdn/",
	userPicturesCdn : "/public/cdn/userPictures/",
	userPicturesCdnOrigin : "/public/cdn/userPictures/",
	sessionSecret : "gLoBo CorrECT",
	sessionNumberOfSeconds : 3600,
	log : {
		output : "console",
		userValidation : {
			level : 2
		},
		avatar : {
			level : 1
		},
		jsonToXml : {
			level : 0
		},
		rooms : {
			level : 0
		},
		realms : {
			level : 0
		}
	},
	getDbConnectionString : function(){
		return 'mongodb://' + this.dbUser + ':' + this.dbPassword + '@' + this.dbHost + ':' + this.dbPort + '/' + this.dbName;
	}
}
