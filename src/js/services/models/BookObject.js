angular.module('VirtualBookshelf')
.factory('BookObject', function ($log, BaseObject, data, subclassOf) {	
	var BookObject = function(dataObject, geometry, material) {
		BaseObject.call(this, dataObject, geometry, material);
	};

	BookObject.TYPE = 'BookObject';

	BookObject.prototype = subclassOf(BaseObject);
	BookObject.prototype.type = BookObject.TYPE;

	BookObject.prototype.save = function() {
		var scope = this;
		var dto = {
			id: this.dataObject.id,
			userId: this.dataObject.userId,
			pos_x: this.position.x,
			pos_y: this.position.y,
			pos_z: this.position.z
		};

		return data.postBook(dto).then(function (responseDto) {
			scope.dataObject = responseDto;
			scope.changed = false;
		});
	};

	BookObject.prototype.rollback = function() {
		this.position.x = this.dataObject.pos_x;
		this.position.y = this.dataObject.pos_y;
		this.position.z = this.dataObject.pos_z;
	};

	BookObject.prototype.setParent = function(parent) {
		if(this.parent != parent) {
			if(parent) {
				parent.add(this);
				this.dataObject.shelfId = parent.id;
				this.dataObject.sectionId = parent.parent.id;
			} else {
				this.parent.remove(this);
				this.dataObject.shelfId = null;
				this.dataObject.sectionId = null;
			}
		}
	};

	return BookObject;
});