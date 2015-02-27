 angular.module('mastermindApp').controller('MasterCtrl', function($scope, MasterService) {
 
 	MasterService.getGrid().then(function(response) {
 		var grid = response.data.grid;
 		var gridLength = grid.length;
 		$scope.masterColors = grid[0];

 		var stickArray = new Array(gridLength-1);
		for (var i = 0; i < gridLength-1; i++) {
			stickArray[i] = new Array(gridLength/2);
		}

		var gameArray = new Array(gridLength-1);
		for (var i = 0; i < gridLength-1; i++) {
			gameArray[i] = new Array(gridLength/2);
		}

		var rowIndexSticks = 0;
		var rowIndexGame = 0;
		var columnIndexGame = 0;

 		angular.forEach(grid, function(el, i){
        			angular.forEach(el, function(e, j) {
        				if (i != 0) {
        					if (j < gridLength/2) {
								if (e != null) {
									stickArray[rowIndexSticks][j] = e;
								} else {
									stickArray[rowIndexSticks][j] = 'gy';
								}

							} else {
								if (e != null) {
									gameArray[rowIndexGame][columnIndexGame] = e;
								} else {
									gameArray[rowIndexGame][columnIndexGame] = 'gy';
								}

								columnIndexGame++;
							}
        				}
        			});

        			if (i != 0) {
        				columnIndexGame = 0;
                        rowIndexSticks++;
                        rowIndexGame++;
        			}
        });

		$scope.stickArray = stickArray;
        $scope.gameArray = gameArray;
 	});

	MasterService.getStatus().then(function(response) {
		var status = response.data;
		$scope.status = status;
	});

	MasterService.getActualRow().then(function(response) {
		var actualRow = response.data;
		$scope.actualRow = actualRow;
	});

	$scope.showSol = function() {
		MasterService.showSolution().then(function(response) {
			var colors = response.data.masterColors;
        	$scope.masterColors = colors;
		});
     };

     $scope.setValue = function(row, col, val) {
     	MasterService.setValue(row, col, val).then(function(response) {

     		if (val == "gy") {
     			val = "yl";
     		}

     		if (val == "yl") {
            	val = "bl";
            }

            if (val == "bl") {
				val = "gr";
			}

			if (val == "gr") {
				val = "rd";
			}

			if (val == "rd") {
				val = "or";
			}

			if (val == "or") {
				val = "pk";
			}

			if (val == "pk") {
				val = "pu";
			}

			if (val == "pu") {
				val = "yl";
			}

     		$scope.gameArray[row][col] = val;
     	});
     }
 });