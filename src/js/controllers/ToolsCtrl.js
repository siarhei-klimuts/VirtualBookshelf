angular.module('VirtualBookshelf')
.controller('ToolsCtrl', function (uiTools) {
    this.isShow = uiTools.isShow;
    this.isRotatable = uiTools.isRotatable;
    this.rotateLeft = uiTools.rotateLeft;
    this.rotateRight = uiTools.rotateRight;
    this.stop = uiTools.stop;
});