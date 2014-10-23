module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		email: DataTypes.STRING,
		position: DataTypes.ARRAY(DataTypes.FLOAT)
	}, {
		timestamps: false,
		classMethods: {
    		getUser: function(id, done) {
				this.find({
					where: {id: id}, 
					attributes: ['position']
				}, {raw: true})
				.success(function (result) {
			  		done(null, result);
				})
				.failure(function (err) {
			  		done(err, null);
				});
    		},
    		saveUser: function(dataObject, done) {
				this.find(dataObject.id)
				.success(function (result) {
					result.updateAttributes(dataObject, ['position'])
					.success(function (result) {
						done(null, result);
					})
					.failure(function (err) {
						done(err, null);
					});
				})
				.failure(function (err) {
					done(err, null);
				});
    		}
		}
	});
} 