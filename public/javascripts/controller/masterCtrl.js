 angular.module('mastermindApp').controller('MasterCtrl', function($scope, MasterService, AuthService, WebsocketService) {

    /**
        * @desc: Creates new game.
    **/
    $scope.init = function() {
        $scope.getStatus();
        $scope.getMastermindColors();
        $scope.getGameGrid();
        $scope.getStickGrid();
        $scope.getActualRow();
        $scope.getRowsAmount();
        $scope.getColumnsAmount();
        $scope.isShown = false;
        $scope.isSolved();

        if ($scope.userMail == null) {
            $scope.userMail = localStorage.getItem('userMail');
        }
    };

    /**
        * @desc: Shows instruction popover.
    **/
    $(function () {
      $('[data-toggle="popover"]').popover()
    })

    /**
        * @desc: Receives game status from server.
    **/
    $scope.getStatus = function() {
        MasterService.getStatus().then(function(response) {
        	var status = response.data;
        	$scope.status = status;
        });
    };

    /**
        * @desc: Sets the 'confirm row'-button on the position of the acrual row
    **/
    $scope.setButtonPosition = function(initial) {
        var marginMul;
        if (initial == 0) {
            marginMul = ($scope.rowsAmount - 1) * 2;
            var buttonPos = ((((marginMul - 2) * 15) + ((marginMul - 1) * 10)) - 3) + "px";
            hr2.style.marginTop = buttonPos;
            $scope.buttonPosition = buttonPos;
        } else if (initial == 1) {
            var newRow;
            var tempSolved = localStorage.getItem('isSolved');
            if (tempSolved == "true") {
                newRow = $scope.rowsAmount - localStorage.getItem('actualRow');
                btnConfirmRow.disabled = true;
            } else {
                if ($scope.rowsAmount - 1 == localStorage.getItem('actualRow')) {
                    newRow = $scope.rowsAmount - localStorage.getItem('actualRow');
                    btnConfirmRow.disabled = true;
                } else {
                    newRow = $scope.rowsAmount - 1 - localStorage.getItem('actualRow');
                }
            }

            marginMul = ((newRow) * 2);
            var buttonPos = ((((marginMul - 2) * 15) + ((marginMul - 1) * 10)) - 3) + "px";
            hr2.style.marginTop = buttonPos;
            $scope.buttonPosition = buttonPos;

        } else {
            var tempPos = $scope.buttonPosition.toString();
            tempPos = parseInt(tempPos);
            var newPos = (tempPos - 50) + "px";
            hr2.style.marginTop = newPos;
            $scope.buttonPosition = newPos;
        }
        $scope.calcGridLines();
    };

    /**
        * @desc: Receives mastermind-colors from server.
    **/
	$scope.getMastermindColors = function() {
        MasterService.getMastermindColors().then(function(response) {
            var masterColors = response.data.masterColors;
            $scope.masterColors = masterColors;
        });
	};

    /**
        * @desc: Receives game-grid from server.
    **/
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

    /**
        * @desc: Receives stick-grid from server.
    **/
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

    /**
        * @desc: Receives actual row from server.
    **/
    $scope.getActualRow = function() {
        MasterService.getActualRow().then(function(response) {
            var actualRow = response.data;
            $scope.actualRow = actualRow;
            localStorage.setItem('actualRow', actualRow);
        });
    };

    /**
        * @desc: Receives rows amount from server.
    **/
    $scope.getRowsAmount = function() {
        MasterService.getRowsAmount().then(function(response) {
            var rowsAmount = response.data;
            $scope.rowsAmount = rowsAmount;
            $scope.setButtonPosition(1);
            localStorage.setItem('userMail', $scope.userMail);
            $scope.calcGridLines();
        });
    };

    /**
        * @desc: Calculates position of grid lines of the stick-grid.
    **/
    $scope.calcGridLines = function() {
        var width;
        if ($scope.rowsAmount == 12) {
            grid.style.width = "70px";
            width = "68px";
        } else if ($scope.rowsAmount == 8) {
            grid.style.width = "50px";
            width = "48px";
        } else {
            grid.style.width = "32px";
            width = "30px";
        }

        for (var i = 0; i < hr4.length; i++) {
            hr4[i].style.width = width;
        }
    };

    /**
        * @desc: Receives columns amount from server.
    **/
    $scope.getColumnsAmount = function(){
        MasterService.getColumnsAmount().then(function(response) {
            var columnsAmount = response.data;
            $scope.columnsAmount = columnsAmount;
        });
    };

    /**
        * @desc: Creates new mastermind game.
    **/
	$scope.newGame = function() {
		MasterService.newGame().then(function() {
		    localStorage.setItem('isSolved', "false");
            localStorage.setItem('actualRow', 0);
		    $scope.init();
		    btnConfirmRow.disabled = false;
		    $scope.setButtonPosition(0);
		});
	};

    /**
        * @desc: Shows the solution of the game.
    **/
	$scope.showSolution = function(location) {
		MasterService.showSolution().then(function(response) {
		    if (!$scope.isShown) {
		        $scope.getMastermindColors();
                if (location == "true") {
                    $scope.getStatus();
                }
                 $scope.isShown = true;
                 //WebsocketService.connect(onMessage);
		    }
		});
    };

    /**
        * @desc: Sets a value at [row][col] of the game-grid.
    **/
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
				    $scope.getStatus();
				    //WebsocketService.connect(onMessage);
				});
			}
   		}
     };

    /**
        * @desc: Confirms the actual row.
    **/
    $scope.confirmRow = function() {
        MasterService.confirmRow().then(function(response) {
            var conf = response.data.conf;
            var tempRowsAmount = ($scope.rowsAmount - 1).toString();
            $scope.getStatus();
            $scope.getStickGrid();
            $scope.solved = conf[1];
            $scope.actualRow = conf[2];
            localStorage.setItem('isSolved', $scope.solved);
            localStorage.setItem('actualRow', $scope.actualRow);

            if (conf[0] == "true") {
                if ($scope.solved == "false" && $scope.actualRow != tempRowsAmount) {
                    $scope.setButtonPosition(2);
                } else if ($scope.solved == "true") {
                    btnConfirmRow.disabled = true;
                    $scope.showSolution("false");
                } else {
                    btnConfirmRow.disabled = true;
                    $scope.showSolution("false");
                }
            }
        });
    };

    /**
        * @desc: Checks if game is solved.
    **/
    $scope.isSolved = function() {
        MasterService.isSolved().then(function(response) {
            var isSolved = response.data;
            $scope.solved = isSolved;
            localStorage.setItem('isSolved', isSolved);
        });
    };

    /**
        * @desc: Increases or decreases size of the game-grid.
    **/
    $scope.resetSize = function(rows, cols) {
        MasterService.resetSize(rows, cols).then(function(response) {
            localStorage.setItem('isSolved', "false");
            localStorage.setItem('actualRow', 0);
            $scope.init();
            btnConfirmRow.disabled = false;
            $scope.setButtonPosition(0);
        });
    };

    function onMessage(msg) {
        var data = JSON.parse(msg.data);

        var gameGrid = data.gameGrid;
        angular.forEach(gameGrid, function(el, i){
            angular.forEach(el, function(e, j) {
                if (e == null) {
                    gameGrid[i][j] = 'gy';
                }
            });
        });
        $scope.gameArray = gameGrid;

        var stickGrid = data.stickGrid;
        angular.forEach(stickGrid, function(el, i){
            angular.forEach(el, function(e, j) {
                if (e == null) {
                    stickGrid[i][j] = 'gy';
                }
            });
        });
        $scope.stickArray = stickGrid;
        $scope.actualRow = data.actualRow;
    }

    $scope.init();
});