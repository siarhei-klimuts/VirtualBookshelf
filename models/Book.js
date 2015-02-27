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
    		getFreeBooks: getFreeBooks,
    		deleteBook: deleteBook
		},
		instanceMethods: {
			updateBook: updateBook
		}
	});
};

function saveBook(dto, userId) {
	var result;

	if(dto && dto.userId === userId) {
		result = this.findOrCreate({id: dto.id}, dto).then(function (result) {
			return result.options.isNewRecord ? result : result.updateBook(dto);
		});
	} else {
		result = Promise.reject('Error saving book.');
	}

	return result;
}

function updateBook(dto) {
	for(var key in dto) {
		this[key] = dto[key];
	}

	return this.save();
}

function getFreeBooks(userId, done) {
	this.findAll({
		where: {userId: userId} 
	}, {raw: true})
	.success(function (result) {
  		done(null, result);
	})
	.failure(function (err){
  		done(err, null);
	});
}

function deleteBook(id, userId) {
	return this.find(id).then(function (book) {
		if(book.userId !== userId) {
			throw new Error('User ' + userId + ' is removing user\'s ' + book.userId + ' book');
		}

		return  book.destroy();
	});
}