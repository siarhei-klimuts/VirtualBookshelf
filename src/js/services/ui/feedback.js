angular.module('VirtualBookshelf')
.factory('feedback', function (user, data, dialog) {
	var feedback = {};
	var show = false;

	feedback.message = null;

	feedback.isShow = function() {
		return show;
	};

	feedback.show = function() {
		show = true;
	};

	feedback.hide = function() {
		show = false;
	};

	feedback.submit = function() {
		var dataObject;
		
		if(this.form.message.$valid) {
			dialog.openConfirm('Send feedback?').then(function () {
				dataObject = {
					message: this.message,
					userId: user.getId()
				};

				return data.postFeedback(dataObject).then(function () {
					this.message = null;
					feedback.hide();
				}, function () {
					dialog.openError('Can not send feedback because of an error.');
				});
			});
		} else {
			dialog.openError('Feedback field is required.');
		}
	};

	return feedback;
});