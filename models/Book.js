module.exports = function(sequelize, DataTypes) {
	return sequelize.define('book', {
		pos_x: DataTypes.FLOAT,
		pos_y: DataTypes.FLOAT,
		pos_z: DataTypes.FLOAT,
		author: DataTypes.STRING,
		title: DataTypes.STRING,
		model: DataTypes.STRING,
		shelfId: DataTypes.INTEGER
	}, {timestamps: false});
} 