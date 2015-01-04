angular.module('VirtualBookshelf')
.factory('CanvasImage', function ($q, Data) {
	var CanvasImage = function(properties, link, image) {
		this.link = link || '';
		this.image = image;
		this.parseProperties(properties);
	};
	
	CanvasImage.prototype = {
		constructor: CanvasImage,

		toString: function() {
			return this.link;
		},
		parseProperties: function(properties) {
			var args = properties && properties.split(',') || [];

			this.x = Number(args[0]) || Data.COVER_FACE_X;
			this.y = Number(args[1]) || 0;
			this.width = Number(args[2]) || 216;
			this.height = Number(args[3]) || Data.COVER_MAX_Y;
		},
		serializeProperties: function() {
			return [this.x, this.y, this.width, this.height].join(',');
		}
	};

	return CanvasImage;
});