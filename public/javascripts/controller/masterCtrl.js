 angular.module('mastermindApp').controller('MasterCtrl', function($scope, MasterService, AuthService, WebsocketService) {

    /**
        * @desc: Creates new game. Is called on load.
    **/
    $scope.init = function() {
        getStatus();
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

    (function( $ ){
       $.fn.newGame = function() {
          MasterService.newGame().then(function() {
              WebsocketService.send("newGame");
          });
          return this;
       };
    })( jQuery );

    (function( $ ){
       $.fn.showSolution = function() {
          MasterService.showSolution().then(function(response) {
                WebsocketService.send("showSolution");
            });
          return this;
       };
    })( jQuery );

    function getStatus() {
        $.ajax({
            type: "GET",
            url: "/getStatus"
        }).success(function(data) {
            var status = data;
            $('#status').text(status);
        });
    }

    /**
        * @desc: Receives mastermind-colors from server.
    **/
	$scope.getMastermindColors = function() {
        ajaxGetMastermindColors();
	};

	function ajaxGetMastermindColors() {
        $.ajax({
            type: "GET",
            url: "/getMastermindColors"
        }).success(function(data) {
             var masterColors = data.masterColors;
             $scope.masterColors = masterColors;
             $scope.$apply();
        });
    }

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
        * @desc: Receives columns amount from server.
    **/
    $scope.getColumnsAmount = function(){
        MasterService.getColumnsAmount().then(function(response) {
            var columnsAmount = response.data;
            $scope.columnsAmount = columnsAmount;
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
        * @desc: Creates new mastermind game.
    **/
	$scope.newGame = function() {
		MasterService.newGame().then(function() {
            WebsocketService.send("newGame");
        });
	};

    /**
        * @desc: Shows the solution of the game.
        * @param: boolean location - if true shows actual status
    **/
	$scope.showSolution = function(location) {
		MasterService.showSolution().then(function(response) {
		    WebsocketService.send("showSolution");
		});
    };

    /**
        * @desc: Sets a value at [row][col] of the game-grid.
        * @param: number row - the actual row
        * @param: number clickedRow - the row the user has clicked
        * @param: number col - the column the user has clicked
        * @param: string val - the chosen color as string
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
				    WebsocketService.send(value);
				});
			}
   		}
     };

    /**
        * @desc: Confirms the actual row.
    **/
    $scope.confirmRow = function() {
        MasterService.confirmRow().then(function(response) {
            WebsocketService.send("confirmRow");
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

    (function( $ ){
       $.fn.resetSize = function(rows, cols) {
          ajax_resetSize(rows, cols);
          return this;
       };
     })( jQuery );

    function ajax_resetSize(rows, cols) {
        $.ajax({
            type: "GET",
            url: "/resetSize/" + rows + "/" + cols
        }).success(function() {
             WebsocketService.send("resetSize");
        });
    }

    /**
        * @desc: Sets the 'confirm row'-button on the position of the actual row
        * @param: number initial - where to set the button
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

        if ($('#status').text() != 'You have won!!' && $('#status').text() != 'You have lost!!' ) {
            $('#status').text(data.status);
        }

        $scope.actualRow = data.actualRow;
        $scope.rowsAmount = data.rowsAmount;
        $scope.columnsAmount = data.columnsAmount;

        if (data.newGame == "true") {
            localStorage.setItem('isSolved', "false");
            localStorage.setItem('actualRow', 0);
            $scope.init();
            btnConfirmRow.disabled = false;
            $scope.setButtonPosition(0);
        }

        if (data.rowWasConfirmed == "true") {
            MasterService.confirmRow2().then(function(response) {
                    var conf = response.data.conf;
                    var tempRowsAmount = ($scope.rowsAmount - 1).toString();
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
        }

        if (data.resetSize == "true") {
            localStorage.setItem('isSolved', "false");
            localStorage.setItem('actualRow', 0);
            $scope.init();
            btnConfirmRow.disabled = false;
            $scope.setButtonPosition(0);
        }

        if(data.showSolution == "true") {
            if (!$scope.isShown) {
                $scope.getMastermindColors();
                $scope.isShown = true;
            }
        }
        $scope.$apply();
    }

    $scope.init();
    WebsocketService.connect(onMessage);
});