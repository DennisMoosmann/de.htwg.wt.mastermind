 angular.module('mastermindApp').controller('MasterCtrl', function($scope, MasterService) {

 	MasterService.getStatus().then(function(response) {
		var status = response.data;
		$scope.status = status;
	});

	MasterService.getMastermindColors().then(function(response) {
		var masterColors = response.data.masterColors;
		$scope.masterColors = masterColors;
	});

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

	MasterService.getActualRow().then(function(response) {
		var actualRow = response.data;
		$scope.actualRow = actualRow;
	});

	MasterService.getRowsAmount().then(function(response) {
		var rowsAmount = response.data;
		$scope.rowsAmount = rowsAmount;
	});

	MasterService.getColumnsAmount().then(function(response) {
		var columnsAmount = response.data;
		$scope.columnsAmount = columnsAmount;
	});

	$scope.showSol = function() {
		MasterService.showSolution().then(function(response) {
			var colors = response.data.masterColors;
        	$scope.masterColors = colors;
		});
    };

   	$scope.setValue = function(row, clickedRow, col, val) {
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
		}
     };
 });