angular.module('mastermindApp').service('MasterService', function($http) {
	var myServiceObject = {
		getGrid: function() {
			return $http.get('/getGrid');
		}
	};
	
	return myServiceObject;
});