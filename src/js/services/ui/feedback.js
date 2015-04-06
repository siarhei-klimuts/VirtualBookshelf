angular.module('VirtualBookshelf')
.factory('feedback', function (data, dialog, ngDialog) {
	var feedback = {};
	var feedbackDialog;

	var PAGE_PATH = '/ui/feedback';

	feedback.show = function() {
		feedbackDialog = ngDialog.open({template: PAGE_PATH});
	};

	feedback.send = function(dto) {
		dialog.openConfirm('Send feedback?').then(function () {
			return data.postFeedback(dto).then(function () {
				feedbackDialog.close();
			}, function () {
				dialog.openError('Can not send feedback because of an error.');
			});
		});
	};

	return feedback;
});