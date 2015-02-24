angular.module('VirtualBookshelf')
.factory('authorization', function ($log, $q, $window, $interval, User, selectLibrary, catalog) {
	var authorization = {};

	authorization.isShow = function() {
		return !User.isAuthorized() && User.isLoaded();
	};

	authorization.google = function() {
		var win = $window.open('/auth/google', '', 'width=800,height=600,modal=yes,alwaysRaised=yes');
	    var checkAuthWindow = $interval(function () {
	        if (win && win.closed) {
	        	$interval.cancel(checkAuthWindow);

	        	User.load().then(function () {
	        		return authorization.loadUserData();
	        	}).catch(function () {
	        		$log.log('User loadind error');
					//TODO: show error message  
	        	});
	        }
	    }, 100);			
	};

	authorization.logout = function() {
		User.logout().finally(function () {
    		return authorization.loadUserData();
		}).catch(function () {
			$log.error('Logout error');
			//TODO: show an error
		});
	};

	authorization.loadUserData = function() {
		return $q.all([
			selectLibrary.updateList(), 
			catalog.loadBooks()
		]);
	};
	
	return authorization;
});