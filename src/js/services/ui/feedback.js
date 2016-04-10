angular.module('VirtualBookshelf')
.factory('feedback', function ($window) {
    const FEEDBACK_URL = 'https://vk.com/topic-95876726_33507668';

	var feedback = {};

	feedback.show = function() {
        var win = $window.open(FEEDBACK_URL, '_blank');
	};

	return feedback;
});