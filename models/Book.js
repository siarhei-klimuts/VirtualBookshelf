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
	}, {timestamps: false});
} 