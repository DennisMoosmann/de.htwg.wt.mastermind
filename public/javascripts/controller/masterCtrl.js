 angular.module('mastermindApp').controller('MasterCtrl', function($scope, MasterService) {
 
 	MasterService.getGrid().then(function(response) {
 		var grid = response.data.grid;
 		var gridLength = grid.length;

 		var stickArray = new Array(gridLength);
		for (var i = 0; i < gridLength; i++) {
			stickArray[i] = new Array(gridLength/2);
		}

		var gameArray = new Array(gridLength);
		for (var i = 0; i < gridLength; i++) {
			gameArray[i] = new Array(gridLength/2);
		}

		var rowIndexSticks = 0;
		var rowIndexGame = 0;
		var columnIndexGame = 0;

 		angular.forEach(grid, function(el, i){
        			angular.forEach(el, function(e, j) {
        				if (j < gridLength/2) {
        					if (e != null) {
        						stickArray[rowIndexSticks][j] = e;
        					} else {
        						stickArray[rowIndexSticks][j] = '-';
        					}

        				} else {
        					if (e != null) {
        						gameArray[rowIndexGame][columnIndexGame] = e;
        					} else {
        						gameArray[rowIndexGame][columnIndexGame] = '-';
        					}

        					columnIndexGame++;
        				}
        			});
        			columnIndexGame = 0;
        			rowIndexSticks++;
        			rowIndexGame++;
        });

		$scope.stickArray = stickArray;
        $scope.gameArray = gameArray;
 	});
 });