var Sequelize = require('sequelize');
var sequelize = new Sequelize(process.env.DATABASE_URL);

module.exports.sequelize = sequelize;

module.exports.User = sequelize.import(__dirname + '/User');
module.exports.Library = sequelize.import(__dirname + '/Library');
module.exports.Section = sequelize.import(__dirname + '/Section');
module.exports.Book = sequelize.import(__dirname + '/Book');

// describe relationships
module.exports.User.hasMany(module.exports.Library);
module.exports.Library.hasMany(module.exports.Section);
module.exports.Section.hasMany(module.exports.Book);

module.exports.Book.belongsTo(module.exports.Section);
module.exports.Book.belongsTo(module.exports.User);
module.exports.Section.belongsTo(module.exports.Library);
module.exports.Section.belongsTo(module.exports.User);
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