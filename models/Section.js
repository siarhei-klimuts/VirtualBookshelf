module.exports = function(sequelize, DataTypes) {
	return sequelize.define('section', {
		pos_x: DataTypes.FLOAT,
		pos_y: DataTypes.FLOAT,
		pos_z: DataTypes.FLOAT,
		rotation: DataTypes.ARRAY(DataTypes.FLOAT),
		model: DataTypes.STRING
	}, {
		timestamps: false,
		classMethods: {
    		saveSection: saveSection,
    		deleteSection: deleteSection
		},
		instanceMethods: {
			updateSection: updateSection
		}
	});
};

function saveSection(dataObject, done) {
	if(dataObject) {
		this.findOrCreate({id: dataObject.id}, dataObject)
		.success(function (result) {
			if(!result.options.isNewRecord) {
				result.updateSection(dataObject, function (err, result) {
					done(err, result);
				});
			} else {
				done(null, result);
			}
		})
		.failure(function (error) {
			console.error('Section save: ', error);
			done(error, null);
		});
	}
}

function updateSection(dataObject, done) {
	for(var key in dataObject) {
		this[key] = dataObject[key];
	}

	this.save()
	.success(function (result) {
		done(null, result);
	})
	.failure(function (error) {
		done(error, null);
	});
}

function deleteSection(id, userId) {
	return this.find(id).then(function (section) {
		if(section.userId !== userId) {
			throw new Error('User ' + userId + ' is removing user\'s ' + section.userId + ' section');
		}

		return  section.destroy();
	});
}