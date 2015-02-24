angular.module('VirtualBookshelf')
.controller('UiCtrl', function ($scope, mainMenu, selectLibrary, createLibrary, createSection, feedback, authorization, navigation, inventory, bookEdit, catalog) {
    $scope.mainMenu = mainMenu;

    $scope.selectLibrary = selectLibrary;
    $scope.createLibrary = createLibrary;
    $scope.createSection = createSection;
    $scope.feedback = feedback;
    $scope.authorization = authorization;

    $scope.inventory = inventory;
    $scope.bookEdit = bookEdit;
    $scope.catalog = catalog;

	$scope.navigation = {
		stop: navigation.goStop,
		forward: navigation.goForward,
		backward: navigation.goBackward,
		left: navigation.goLeft,
		right: navigation.goRight
	};
});