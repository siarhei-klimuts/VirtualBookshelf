angular.module('VirtualBookshelf')
.factory('SectionObject', function (BaseObject, ShelfObject, data) {
	var SectionObject = function(params, geometry, material) {
		BaseObject.call(this, params, geometry, material);

		this.shelves = {};
		for(var key in params.data.shelves) {
			this.shelves[key] = new ShelfObject(params.data.shelves[key]); 
			this.add(this.shelves[key]);
		}
	};

	SectionObject.TYPE = 'SectionObject';

	SectionObject.prototype = new BaseObject();
	SectionObject.prototype.constructor = SectionObject;
	SectionObject.prototype.type = SectionObject.TYPE;

	SectionObject.prototype.save = function() {
		var scope = this;
		var dto = {
			id: this.dataObject.id,
			userId: this.dataObject.userId,
			pos_x: this.position.x,
			pos_y: this.position.y,
			pos_z: this.position.z,
			rotation: [this.rotation.x, this.rotation.y, this.rotation.z]
		};

		return data.postSection(dto).then(function (responseDto) {
			scope.dataObject = responseDto;
			scope.changed = false;
		});
	};

	SectionObject.prototype.rollback = function() {
		this.position.x = this.dataObject.pos_x;
		this.position.y = this.dataObject.pos_y;
		this.position.z = this.dataObject.pos_z;

		this.rotation.x = this.dataObject.rotation[0];
		this.rotation.y = this.dataObject.rotation[1];
		this.rotation.z = this.dataObject.rotation[2];
	};

	SectionObject.prototype.setParent = function(parent) {
		if(this.parent != parent) {
			if(parent) {
				parent.add(this);
				this.dataObject.libraryId = parent.id;
			} else {
				this.parent.remove(this);
				this.dataObject.libraryId = null;
			}
		}
	};

	return SectionObject;
});