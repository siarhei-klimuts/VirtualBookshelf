module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		email: DataTypes.STRING,
		name: DataTypes.STRING,
		googleId: DataTypes.STRING,
		twitterId: DataTypes.STRING,
		temporary: DataTypes.BOOLEAN,
	}, {
		timestamps: false,
		classMethods: {
    		getUser: function(id, done) {
				this.find({
					where: {id: id}, 
					attributes: ['id', 'name', 'email', 'temporary', 'googleId', 'twitterId']
				}, {raw: true})
				.success(function (result) {
			  		done(null, result);
				})
				.failure(function (err) {
			  		done(err, null);
				});
    		},
    		saveUser: function(dto) {
				return this.find(dto.id).then(function (user) {
					return user.updateAttributes(dto, ['name', 'email', 'temporary']);
				});
    		}
		}
	});
};