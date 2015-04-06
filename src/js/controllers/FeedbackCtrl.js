angular.module('VirtualBookshelf')
.controller('FeedbackCtrl', function (feedback, user, dialog) {
	this.submit = function() {
		if(this.form.message.$valid) {
			feedback.send({
				message: this.message,
				userId: user.getId()
			});
		} else {
			dialog.openError('Feedback field is required.');
		}
	};
});