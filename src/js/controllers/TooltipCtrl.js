import {BookObject} from 'js/services/scene';

angular.module('VirtualBookshelf')
.controller('TooltipCtrl', function (tooltip) {
    this.isShow = function() {
        return tooltip.obj.type === BookObject.TYPE;
    };

    this.obj = tooltip.obj;
});