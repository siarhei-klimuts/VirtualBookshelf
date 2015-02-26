angular.module('VirtualBookshelf')
.controller('ToolsCtrl', function (tools) {
    this.isShow = tools.isShow;
    this.isRotatable = tools.isRotatable;
    this.rotateLeft = tools.rotateLeft;
    this.rotateRight = tools.rotateRight;
    this.stop = tools.stop;
});