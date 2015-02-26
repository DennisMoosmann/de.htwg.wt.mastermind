//angular.module('mastermindApp').service('MasterService', function($http) {
//	var myServiceObject = {
//		getGrid: function() {
//			return $http.get('/getGrid');
//		}
//	};
//
//	return myServiceObject;
//});

angular.module('mastermindApp')

.service('MasterService', function($http) {
    return {
//        getStatus: function() {
//            return $http.get('/getStatus');
//        },
        getGrid: function() {
            return $http.get('/getGrid');
        },
        getStatus: function() {
        	return $http.get('/getStatus');
        }
    };
});