package controllers;

import de.htwg.se.mastermind.controller.IController;
import de.htwg.se.mastermind.model.IGrid;


/**
 * The Helper class imports the game-field and stick-grid from the controller because they are used more than once.
 *
 * @author  Dennis Moosmann
 * @version 1.0
 * @since   2015-03-10
 */
public class Helper {
    private IController controller;

    /**
     * Constructor
     * @param ctrl The mastermind controller
     */
    public Helper(IController ctrl) {
        this.controller = ctrl;
    }

    /**
     * Used to get the actual game-field from controller.
     * @return The game-field.
     */
    public String[][] getGameField() {
        IGrid grid = this.controller.getGrid();
        String[][] field = new String[grid.getRowsAmount()-1][grid.getColumnsAmount()/2];

        int rowIndex = 0;
        int columnIndex = 0;
        for (int i = controller.getRowsAmount() - 2; i >= 0; i--) {
            for (int j = controller.getColumnsAmount()/2 - 1; j >= 0; j--) {
                field[rowIndex][columnIndex] = controller.getValue(i, j);
                columnIndex++;
            }
            columnIndex = 0;
            rowIndex++;
        }

        return field;
    }

    /**
     * Used to get the actual stick-grid from controller.
     * @return The stick-grid.
     */
    public String[][] getStickGrid() {
        IGrid grid = controller.getGrid();
        int rowsAmount = (grid.getRowsAmount() - 1) * 2;
        int columnsAmount = grid.getRowsAmount()/4;
        String [][] field = new String[rowsAmount][columnsAmount];

        int rowIndex = 0;
        int colIndex = 0;

        for (int i = controller.getRowsAmount() - 2; i >= 0; i--) {
            for (int j = controller.getColumnsAmount()/2; j < controller.getColumnsAmount(); j++) {
                field[rowIndex][colIndex] = controller.getValue(i, j);
                colIndex++;

                if (colIndex >= controller.getColumnsAmount()/4) {
                    colIndex = 0;
                    rowIndex++;
                }
            }
        }

        return field;
    }

    public String getStatus() {
        return controller.getStatusLine();
    }

    public int getActualRow() {
        return controller.getActualRow();
    }

    public String [] getMastermindColors() {
        String [] masterColors = controller.getMastermindColors();
        String [] newOrder = new String[masterColors.length];

        int index = masterColors.length - 1;
        for (int i = 0; i < masterColors.length; i++) {
            newOrder[i] = masterColors[index];
            index--;
        }

        return  newOrder;
    }

    public String [] getNewMastermindColors() {
        String [] newMastermindColors = new String[controller.getMastermindColors().length];
        for (int i = 0; i < newMastermindColors.length; i++) {
            newMastermindColors[i] = "xx";
        }

        return newMastermindColors;
    }

    public int getRowsAmount() {
        return controller.getRowsAmount();
    }

    public int getColumnsAmount() {
        return controller.getColumnsAmount();
    }
}
