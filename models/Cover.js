module.exports = function(sequelize, DataTypes) {
	return sequelize.define('cover', {
		url: DataTypes.STRING,
		tags: DataTypes.STRING,
		color: DataTypes.STRING
	}, {
		timestamps: false,
		classMethods: {
			updateTags: updateTags,
			mergeTags: mergeTags
		}
	});
};

function updateTags(id, newTags) {
	var mergedTags;
	
	return this.find(id).then(function (cover) {
		mergedTags = mergeTags(cover.tags, newTags);

		cover.tags = mergedTags;
		cover.save();
	});
}

function mergeTags(tags, newTags) {
	var result = tags || '';

	newTags.forEach(function (newTag) {
		if(result.indexOf(newTag) === -1) {
			result = result ? [result, newTag].join() : newTag;
		}
	});

	return result;
}