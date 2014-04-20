module.exports = function(sequelize, DataTypes) {
	return sequelize.define('feedback', {
		message: DataTypes.TEXT
	}, {
		timestamps: false,
		classMethods: {
    		saveFeedback: function(dataObject, done) {
    			this.create(dataObject)
    			.success(function (result) {
    				done(null, result);
    			})
				.failure(function (error) {
					done(error, null);
				});
    		}
		}
	});
};