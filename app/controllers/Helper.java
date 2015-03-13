package controllers;

import de.htwg.se.mastermind.Mastermind;
import de.htwg.se.mastermind.controller.IController;
import de.htwg.se.mastermind.model.IGrid;
import play.*;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.F;
import play.libs.Json;
import play.mvc.*;
import play.mvc.WebSocket;
import views.html.*;
import com.fasterxml.jackson.databind.JsonNode;

public class Helper {
    private IController controller;

    public Helper(IController ctrl) {
        this.controller = ctrl;
    }

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
}
