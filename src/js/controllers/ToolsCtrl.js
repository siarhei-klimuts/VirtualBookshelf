angular.module('VirtualBookshelf')
.controller('ToolsCtrl', function (user, selector, tools, preview) {
    this.isShow = function() {
		return selector.isSelectedEditable() || preview.isActive();
	};

    this.isRotatable = function() {
		return selector.isSelectedSection() || preview.isActive();
	};

    this.isDeletable = function() {
		return selector.isSelectedEditable() && user.isAuthorized();
	};

    this.isWatchable = function() {
        return selector.isSelectedBook() && !preview.isActive();
    };

    this.watch = function()  {
        var obj = selector.getSelectedObject();
        preview.enable(obj);
    };

    this.unwatch = preview.disable;
    this.isWatchActive = preview.isActive;

    this.rotateLeft = tools.rotateLeft;
    this.rotateRight = tools.rotateRight;
    this.stop = tools.stop;

    this.delete = tools.delete;
});