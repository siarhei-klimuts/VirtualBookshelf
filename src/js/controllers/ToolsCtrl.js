angular.module('VirtualBookshelf')
.controller('ToolsCtrl', function (user, selector, tools) {
    this.isShow = function() {
		return user.isAuthorized() && selector.isSelectedEditable();
	};

    this.isRotatable = function() {
		return selector.isSelectedSection();
	};

    this.isDeletable = function() {
		return selector.isSelectedEditable();
	};

    this.delete = tools.delete;
    this.rotateLeft = tools.rotateLeft;
    this.rotateRight = tools.rotateRight;
    this.stop = tools.stop;
});