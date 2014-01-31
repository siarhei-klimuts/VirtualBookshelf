var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL);

exports.library = require('./libraryDao');
exports.user = require('./userDao');

exports.init = function(done) {
	sequelize
	.authenticate()
	.complete(function(err) {
		if(err) {
	  		console.log('DAO: Unable to connect to the database:', err);
	  		done(err);
		} else {
	  		console.log('DAO: Connection has been established successfully.');
	  		defineModels();
	  		syncDatabase(function(err) {
		     	if(err) {
		     	  	console.log('DAO: An error occurred while database sync:', err);
		     	} else {
		     	  	console.log('DAO: Database synced');
		     	}

		     	done(err);
	  		});
	  	}
	});
}

var User, Library, Book, Shelf, Section;

function defineModels() {
	User = sequelize.define('user', {
		email: Sequelize.STRING
	}, {timestamps: false});

	Library = sequelize.define('library', {
	}, {timestamps: false});

	Section = sequelize.define('section', {
		pos_x: Sequelize.FLOAT,
		pos_y: Sequelize.FLOAT,
		pos_z: Sequelize.FLOAT,
		dir_x: Sequelize.FLOAT,
		dir_y: Sequelize.FLOAT,
		dir_z: Sequelize.FLOAT
	}, {timestamps: false});

	 Shelf = sequelize.define('shelf', {
		pos_x: Sequelize.FLOAT,
		pos_y: Sequelize.FLOAT,
		pos_z: Sequelize.FLOAT		
	}, {timestamps: false});

	 Book = sequelize.define('book', {
		pos_x: Sequelize.FLOAT,
		pos_y: Sequelize.FLOAT,
		pos_z: Sequelize.FLOAT		
	}, {timestamps: false});

	User.hasMany(Library);
	Library.hasMany(Section);
	Section.hasMany(Shelf);
	Shelf.hasMany(Book);

	Book.belongsTo(Shelf);
	Shelf.belongsTo(Section);
	Section.belongsTo(Library);
	Library.belongsTo(User);
}

function syncDatabase(done) {
	sequelize
  	.sync({force:false})
  	.complete(function(err) {
  		done(err);
  	});
}