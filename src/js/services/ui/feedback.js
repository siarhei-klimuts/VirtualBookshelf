angular.module('VirtualBookshelf')
.factory('feedback', function (data, dialog, ngDialog) {
	var feedback = {};
	var feedbackDialog;

	var TEMPLATE = 'feedbackDialog';

	feedback.show = function() {
		feedbackDialog = ngDialog.open({template: TEMPLATE});
	};

	feedback.send = function(dto) {
        VK.init({apiId: 4863279});
        VK.Api.call('board.addComment', {
            group_id: 95876726,
            topic_id: 33507668,
            text: 'test'
        }, function(res) {
            console.log('***', res);
        });
        
		// dialog.openConfirm('Send feedback?').then(function () {
		// 	return data.postFeedback(dto).then(function () {
		// 		feedbackDialog.close();
		// 	}, function () {
		// 		dialog.openError('Can not send feedback because of an error.');
		// 	});
		// });
	};

	return feedback;
});