angular.module('VirtualBookshelf')
.factory('CanvasImage', function (Data) {
	var CanvasImage = function(properties) {
		this.link = '';
		this.image = null;
		this.parseProperties(properties);
	};
	CanvasImage.prototype = {
		constructor: CanvasImage,
		load: function(link, proxy, done) {
			var scope = this;
			function sync(link, image) {
				scope.link = link;
				scope.image = image;
				done();
			}

			if(scope.link != link && link) {
				var path = (proxy ? '/outside?link={link}' : '/obj/bookTextures/{link}.jpg').replace('{link}', link);
				Data.loadImage(path).then(function (image) {
					sync(link, image);				
				});
			} else if(!link) {
				sync(link);
			} else {
				done();
			}
		},
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