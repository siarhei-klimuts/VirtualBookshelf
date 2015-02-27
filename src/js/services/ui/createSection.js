angular.module('VirtualBookshelf')
.factory('createSection', function ($log, user, environment, locator) {
	var createSection = {};
	
	var EMPTY_IMAGE_URL = '/img/empty_cover.jpg';

	createSection.list = [];
	createSection.model = null;
	createSection.visible = false;

	createSection.isShow = function() {
		return this.visible;
	};

	createSection.show = function() {
		this.visible = true;
	};

	createSection.hide = function() {
		this.visible = false;
	};
	
	createSection.getImg = function() {
		return this.model ? '/obj/sections/{model}/img.jpg'.replace('{model}', this.model) : EMPTY_IMAGE_URL;
	};

	createSection.create = function() {
		if(this.model) {
			var sectionData = {
				model: this.model,
				libraryId: environment.library.id,
				userId: user.getId()
			};

			this.place(sectionData);
		}
	};

	createSection.place = function(dto) {
		//TODO: block
		locator.placeSection(dto).catch(function (error) {
			//TODO: show an error
			$log.error(error);
		});	
	};

	return createSection;
});