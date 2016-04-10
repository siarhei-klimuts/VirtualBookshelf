angular.module('VirtualBookshelf')
.factory('block', function (blockUI) {
	var block = {};

	var GLOBAL = 'global';

	block.inventory = blockUI.instances.get(GLOBAL);
	block.global = blockUI.instances.get(GLOBAL);

	return block;
});