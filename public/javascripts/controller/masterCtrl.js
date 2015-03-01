 angular.module('mastermindApp').controller('MasterCtrl', function($scope, MasterService) {

    $scope.init = function() {
        $scope.getStatus();
        $scope.getMastermindColors();
        $scope.getGameGrid();
        $scope.getStickGrid();
        $scope.getActualRow();
        $scope.getRowsAmount();
        $scope.getColumnsAmount();
    };

    $scope.getStatus = function() {
        MasterService.getStatus().then(function(response) {
        	var status = response.data;
        	$scope.status = status;
        });
    };

	$scope.getMastermindColors = function() {
        MasterService.getMastermindColors().then(function(response) {
            var masterColors = response.data.masterColors;
            $scope.masterColors = masterColors;
        });
	};

    $scope.getGameGrid = function() {
        MasterService.getGameGrid().then(function(response) {
            var gameGrid = response.data.gameGrid;

            angular.forEach(gameGrid, function(el, i){
                angular.forEach(el, function(e, j) {
                    if (e == null) {
                        gameGrid[i][j] = 'gy';
                    }
                });
            });
            $scope.gameArray = gameGrid;
        });
    };

    $scope.getStickGrid = function() {
        MasterService.getStickGrid().then(function(response) {
            var stickGrid = response.data.stickGrid;

            angular.forEach(stickGrid, function(el, i){
                angular.forEach(el, function(e, j) {
                    if (e == null) {
                        stickGrid[i][j] = 'gy';
                    }
                });
            });
            $scope.stickArray = stickGrid;
        });
    };

    $scope.getActualRow = function() {
        MasterService.getActualRow().then(function(response) {
            var actualRow = response.data;
            $scope.actualRow = actualRow;
        });
    };

    $scope.getRowsAmount = function() {
        MasterService.getRowsAmount().then(function(response) {
            var rowsAmount = response.data;
            $scope.rowsAmount = rowsAmount;
        });
    };

    $scope.getColumnsAmount = function(){
        MasterService.getColumnsAmount().then(function(response) {
            var columnsAmount = response.data;
            $scope.columnsAmount = columnsAmount;
        });
    };

	$scope.newGame = function() {
		MasterService.newGame().then(function() {
		    $scope.init();
		});
	};

	$scope.showSolution = function() {
		MasterService.showSolution().then(function(response) {
			$scope.getMastermindColors();
		});
    };

   	$scope.setValue = function(row, clickedRow, col, val) {
   	    $scope.isSolved();
   		if (!$scope.solved) {
   			newRow = $scope.rowsAmount - 2 - row;

			if (newRow == clickedRow) {
				var value;
				if (val == "gy") {
					value = "yl";
				}

				if (val == "yl") {
					value = "bl";
				}

				if (val == "bl") {
					value = "gr";
				}

				if (val == "gr") {
					value = "rd";
				}

				if (val == "rd") {
					value = "or";
				}

				if (val == "or") {
					value = "pk";
				}

				if (val == "pk") {
					value = "pu";
				}

				if (val == "pu") {
					value = "yl";
				}


				$scope.gameArray[newRow][col] = value;
				newCol = $scope.columnsAmount/2 - 1 - col;

				MasterService.setValue(row, newCol, value).then(function(response) {
				});
				$scope.getStatus();
			}
   		}
     };

     $scope.confirmRow = function() {
		MasterService.confirmRow().then(function(response) {
		    $scope.getStatus();
		    $scope.getStickGrid();
			$scope.actualRow = response.data;
			if ($scope.isSolved()) {
				btnConfirmRow.disabled = true;
			}
		});
     };

     $scope.isSolved = function() {
     	MasterService.isSolved().then(function(response) {
     		var isSolved = response.data;
     		$scope.solved = isSolved;
     	});
     };

     $scope.resetSize = function(rows, cols) {
        MasterService.resetSize(rows, cols).then(function(response) {
            $scope.init();
        });
     };

     $scope.init();
 });