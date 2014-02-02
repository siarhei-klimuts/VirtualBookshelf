var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL);

module.exports.sequelize = sequelize;

module.exports.User = sequelize.import(__dirname + '/user');
module.exports.Library = sequelize.import(__dirname + '/library');
module.exports.LibraryObject = sequelize.import(__dirname + '/libraryObject');
module.exports.Section = sequelize.import(__dirname + '/section');
module.exports.SectionObject = sequelize.import(__dirname + '/sectionObject');
module.exports.Shelf = sequelize.import(__dirname + '/shelf');
module.exports.Book = sequelize.import(__dirname + '/book');
module.exports.BookObject = sequelize.import(__dirname + '/bookObject');

// describe relationships
module.exports.User.hasMany(module.exports.Library);
module.exports.LibraryObject.hasMany(module.exports.Library);
module.exports.Library.hasMany(module.exports.Section);
module.exports.Section.hasMany(module.exports.Book);
module.exports.SectionObject.hasMany(module.exports.Shelf);
module.exports.SectionObject.hasMany(module.exports.Section);
module.exports.Shelf.hasMany(module.exports.Book);
module.exports.BookObject.hasMany(module.exports.Book);

module.exports.Book.belongsTo(module.exports.Section);
module.exports.Book.belongsTo(module.exports.Shelf);
module.exports.Book.belongsTo(module.exports.BookObject);
module.exports.Book.belongsTo(module.exports.User);
module.exports.Shelf.belongsTo(module.exports.SectionObject);
module.exports.Section.belongsTo(module.exports.SectionObject);
module.exports.Section.belongsTo(module.exports.Library);
module.exports.Section.belongsTo(module.exports.User);
module.exports.Library.belongsTo(module.exports.LibraryObject);
module.exports.Library.belongsTo(module.exports.User);

exports.init = function(done) {
	sequelize
	.authenticate()
	.complete(function(err) {
		if(err) {
	  		done(err);
		} else {
	  		syncDatabase(function(err) {
		     	done(err);
	  		});
	  	}
	});
}

function syncDatabase(done) {
	sequelize
  	.sync({force: false})
  	.complete(function(err) {
  		done(err);
  	});
}