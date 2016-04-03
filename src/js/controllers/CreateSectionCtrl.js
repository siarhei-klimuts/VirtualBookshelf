angular.module('VirtualBookshelf')
.controller('CreateSectionCtrl', function (createSection, data) {
	this.model = null;
	this.list = data.getUIData().bookshelves;

	this.getImg = function() {
		return createSection.getImg(this.model);
	};
		
	this.create = function() {
		createSection.create(this.model);
	};
});