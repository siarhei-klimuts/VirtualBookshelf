module.exports = function(sequelize, DataTypes) {
	return sequelize.define('user', {
		email: DataTypes.STRING,
		name: DataTypes.STRING,
		googleId: DataTypes.STRING,
		twitterId: DataTypes.STRING,
		facebookId: DataTypes.STRING,
		vkontakteId: DataTypes.STRING,
		temporary: DataTypes.BOOLEAN,
	}, {
		timestamps: false,
		classMethods: {
    		saveUser: function(dto) {
				return this.find(dto.id).then(function (user) {
					return user.updateAttributes(dto, ['name', 'email', 'temporary']);
				});
    		}
		}
	});
};