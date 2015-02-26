var Sequelize = require('sequelize');
var match = process.env.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
var sequelize = new Sequelize(match[5], match[1], match[2], {
      dialect:  'postgres',
      protocol: 'postgres',
      port:     match[4],
      host:     match[3],
      logging:  false
    });

exports.sequelize = sequelize;

exports.User = sequelize.import(__dirname + '/User');
exports.Library = sequelize.import(__dirname + '/Library');
exports.Section = sequelize.import(__dirname + '/Section');
exports.Book = sequelize.import(__dirname + '/Book');
exports.Feedback = sequelize.import(__dirname + '/Feedback');
exports.Cover = sequelize.import(__dirname + '/Cover');

// describe relationships
exports.User.hasMany(exports.Library);
exports.User.hasMany(exports.Feedback);
exports.Library.hasMany(exports.Section);
exports.Section.hasMany(exports.Book);
exports.Cover.hasMany(exports.Book);

exports.Book.belongsTo(exports.Section);
exports.Book.belongsTo(exports.User);
exports.Section.belongsTo(exports.Library);
exports.Section.belongsTo(exports.User);
exports.Library.belongsTo(exports.User);

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
};

function syncDatabase(done) {
	sequelize
  	.sync({force: false})
  	.complete(function(err) {
  		done(err);
  	});
}