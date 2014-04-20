var Sequelize = require('sequelize');

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('book', {
		pos_x: DataTypes.FLOAT,
		pos_y: DataTypes.FLOAT,
		pos_z: DataTypes.FLOAT,
		shelfId: DataTypes.INTEGER,
		model: DataTypes.STRING,
		texture: DataTypes.STRING,
		cover: DataTypes.STRING,
		coverPos: DataTypes.STRING,
		author: DataTypes.STRING,
		title: DataTypes.STRING,
		authorFont: DataTypes.STRING,
		titleFont: DataTypes.STRING
	}, {
		timestamps: false,
		classMethods: {
    		saveBook: saveBook,
    		getFreeBooks: getFreeBooks
		},
		instanceMethods: {
			updateBook: updateBook
		}
	});
};

function saveBook(dataObject, done) {
	var scope = this;

	if(dataObject) {
		this.findOrCreate({id: dataObject.id}, dataObject)
		.success(function (result) {
			if(!result.options.isNewRecord) {
				result.updateBook(dataObject, function (err, result) {
					done(err, result);
				});
			} else {
				done(null, result);
			}
		})
		.failure(function (error) {
			done(error, null);
		});
	}
};

function updateBook(dataObject, done) {
	for(key in dataObject) {
		this[key] = dataObject[key];
	}

	this.save()
	.success(function (result) {
		done(null, result);
	})
	.failure(function (error) {
		done(error, null);
	});
};

function getFreeBooks(userId, done) {
	this.findAll({
		where: Sequelize.and(
			{userId: userId},
			Sequelize.or(
				{sectionId: null},
				{shelfId: null}
			)
		) 
	}, {raw: true})
	.success(function (result) {
  		done(null, result);
	})
	.failure(function (err){
  		done(err, null);
	});
};