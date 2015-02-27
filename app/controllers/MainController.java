package controllers;


import de.htwg.se.mastermind.Mastermind;
import de.htwg.se.mastermind.controller.IController;
import de.htwg.se.mastermind.model.IGrid;
import play.*;
import play.libs.Json;
import play.mvc.*;
import views.html.*;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.awt.*;

public class MainController extends Controller {

	static IController controller = Mastermind.getInstance().getController();
    
    public static Result index() {
		return ok(views.html.index.render("HTWG Mastermind", controller));
    }
    
    public static Result commandline(String command) {
    	Mastermind.getInstance().getTUI().processInputLine(command);
    	return ok(views.html.index.render("Got your command "+ command, controller));
    }
    
    /*
     * Gets the actual grid with it's values
     */
    public static Result getGrid() {
    	IGrid grid = controller.getGrid();
    	String[][] field = new String[grid.getRowsAmount()][grid.getColumnsAmount()];
    	ObjectNode result = Json.newObject();

		int rowIndex = 0;
		int columnIndex = 0;
		for (int i = controller.getRowsAmount() - 1; i >= 0; i--) {
			for (int j = controller.getColumnsAmount() - 1; j >= 0; j--) {
				field[rowIndex][columnIndex] = controller.getValue(i, j);
				columnIndex++;
			}
			columnIndex = 0;
			rowIndex++;
		}
    	
    	result.put("grid", Json.toJson(field));
    	return ok(result);
    }
    
    public static Result setValue(int row, int column, String value) {
		controller.setValue(row, column, value);
    	return ok();
    }
    
    public static Result resetSize(int rows, int columns) {
    	controller.resetSize(rows, columns);
    	return ok();
    }
    
    public static Result confirmRow() {
    	controller.confirmRow();
    	return ok();
    }
    
    public static Result getMastermindColors() {
    	String [] masterColors = controller.getMastermindColors();
    	ObjectNode result = Json.newObject();
    	result.put("masterColors", Json.toJson(masterColors));
    	return ok(result);
    }
    
    public static Result showSolution() {
    	controller.showSolution();
		String [] masterColors = controller.getMastermindColors();
		ObjectNode result = Json.newObject();
		result.put("masterColors", Json.toJson(masterColors));
    	return ok(result);
    }
    
    public static Result getRowsAmount() {
    	int rowsAmount = controller.getRowsAmount();
    	return ok(String.valueOf(rowsAmount));
    }
    
    public static Result getColumnsAmount() {
    	int columnsAmount = controller.getColumnsAmount();
    	return ok(String.valueOf(columnsAmount));
    }

	public static Result getColorFromString(String color) {
		if (color.equals("-")) {
			color = null;
		}
		Color c = controller.getColorFromString(color);
		return ok(String.valueOf(c));
	}

	public static Result getStatus() {
		String state = controller.getStatusLine();
		return ok(state);
	}

	public static Result getActualRow() {
		int actualRow = controller.getActualRow();
		return ok(String.valueOf(actualRow));
	}
}
