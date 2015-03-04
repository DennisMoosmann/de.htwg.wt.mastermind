 angular.module('mastermindApp').controller('MasterCtrl', function($scope, $timeout, MasterService) {

    $scope.init = function() {
        $scope.getStatus();
        $scope.getMastermindColors();
        $scope.getGameGrid();
        $scope.getStickGrid();
        $scope.getActualRow();
        $scope.getRowsAmount();
        $scope.getColumnsAmount();
        //$scope.isSolved();
        $scope.solved = "false";
        $scope.isShown = false;

        $scope.$watch("stickBall", function(){
            $scope.setButtonPosition(true);
        });

    };

    $scope.getStatus = function() {
        MasterService.getStatus().then(function(response) {
        	var status = response.data;
        	$scope.status = status;
        });
    };

    $scope.setButtonPosition = function(initial) {
        if (initial) {
            var stickRows = stickBall.length;
            var gridCols = $scope.stickArray[0].length;
            var marginMul = (stickRows/gridCols);
            var buttonPos = ((((marginMul - 2) * 15) + ((marginMul - 1) * 10)) + 3) + "px";

            if ($scope.rowsAmount == 12) {
                btnConfirmRow.style.marginTop = buttonPos;
            } else if ($scope.rowsAmount == 8) {
                btnConfirmRow.style.marginTop = buttonPos;
            } else {
                btnConfirmRow.style.marginTop = buttonPos;
            }

            $scope.buttonPosition = buttonPos;

        } else {
            var tempPos = $scope.buttonPosition.toString();
            tempPos = parseInt(tempPos);
            var newPos = (tempPos - 50) + "px";
            btnConfirmRow.style.marginTop = newPos;
            $scope.buttonPosition = newPos;
        }
    }

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
            //$scope.setButtonPosition(true);
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
		    btnConfirmRow.disabled = false;
		});
	};

	$scope.showSolution = function(location) {
		MasterService.showSolution().then(function(response) {
		    if (!$scope.isShown) {
		        $scope.getMastermindColors();
                if (location == "true") {
                    $scope.getStatus();
                }
                 $scope.isShown = true;
		    }
		});
    };

   	$scope.setValue = function(row, clickedRow, col, val) {
   		if ($scope.solved == "false") {
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
            var conf = response.data.conf;
            var tempRowsAmount = ($scope.rowsAmount - 1).toString();
            $scope.getStatus();
            $scope.getStickGrid();
            $scope.solved = conf[1];
            $scope.actualRow = conf[2];


            if (conf[0] == "true") {
                if ($scope.solved == "false" && $scope.actualRow != tempRowsAmount) {
                    //setButtonPosition(false);
                } else {
                    btnConfirmRow.disabled = true;
                    $scope.showSolution("false");
                }

            }



            //$scope.getActualRow();
            //$scope.isSolved();

            //$scope.actualRow = response.data;
            //$scope.isSolved();
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
            btnConfirmRow.disabled = false;
        });
    };

    $scope.init();
 });