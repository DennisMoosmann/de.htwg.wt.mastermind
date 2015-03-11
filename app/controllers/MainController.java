package controllers;


import de.htwg.se.mastermind.Mastermind;
import de.htwg.se.mastermind.controller.IController;
import de.htwg.se.mastermind.model.IGrid;
import play.*;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.Json;
import play.mvc.*;
import views.html.*;
import com.fasterxml.jackson.databind.JsonNode;
import java.awt.*;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.LinkedHashMap;
import java.util.Map;

public class MainController extends Controller {

    static IController controller = Mastermind.getInstance().getController();

    public static Result index() {
        return ok(views.html.index.render("HTWG Mastermind", controller));
    }

    public static Result auth() {
        final String CLIENT_ID = "723736591091-fqdhdi5d3eql2k1fqp6tlkd8id84b10l.apps.googleusercontent.com";
        final String APPLICATION_NAME = "Mastermind";

        String state = new BigInteger(130, new SecureRandom()).toString(32);
        session("state", state);

        Map m1 = new LinkedHashMap();

        m1.put("client_id", CLIENT_ID);
        m1.put("state", state);
        m1.put("application_name", APPLICATION_NAME);
        return ok(Json.toJson(m1));
    }

    public static Result getGameGrid() {
        IGrid grid = controller.getGrid();
        String[][] field = new String[grid.getRowsAmount()-1][grid.getColumnsAmount()/2];
        ObjectNode result = Json.newObject();

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

        result.put("gameGrid", Json.toJson(field));
        return ok(result);
    }

    public static Result getStickGrid() {
        IGrid grid = controller.getGrid();
        int rowsAmount = (grid.getRowsAmount() - 1) * 2;
        int columnsAmount = grid.getRowsAmount()/4;
        String [][] field = new String[rowsAmount][columnsAmount];
        ObjectNode result = Json.newObject();

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

        result.put("stickGrid", Json.toJson(field));
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
        //int actualRow = controller.getActualRow();
        String [] conf = new String[3];
        conf[0] = String.valueOf(controller.getRowConfirmed());
        conf[1] = String.valueOf(controller.isSolved());
        conf[2] = String.valueOf(controller.getActualRow());

        ObjectNode result = Json.newObject();
        result.put("conf", Json.toJson(conf));

        return ok(result);
    }

    public static Result getMastermindColors() {
        IGrid grid = controller.getGrid();
        String [] masterColors = new String[controller.getColumnsAmount()/2];

        int index = 0;
        for (int i = masterColors.length-1; i >= 0; i--) {
            masterColors[index] = controller.getValue(controller.getRowsAmount() - 1, i);
            index++;
        }

        ObjectNode result = Json.newObject();
        result.put("masterColors", Json.toJson(masterColors));
        return ok(result);
    }

    public static Result showSolution() {
        controller.showSolution();
        String [] masterColors = controller.getMastermindColors();
        String [] newOrder = new String[masterColors.length];

        int index = masterColors.length - 1;
        for (int i = 0; i < masterColors.length; i++) {
            newOrder[i] = masterColors[index];
            index--;
        }

        ObjectNode result = Json.newObject();
        result.put("masterColors", Json.toJson(newOrder));
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

    public static Result newGame() {
        int rowsAmount = controller.getRowsAmount();
        int columnsAmount = controller.getColumnsAmount();
        controller.create(rowsAmount, columnsAmount);
        return ok();
    }

    public static Result isSolved() {
        boolean isSolved = controller.isSolved();
        return ok(String.valueOf(isSolved));
    }

    public static Result signIn(String mail, String password) {
        return ok();
    }

    public static WebSocket<String> webSocket() {
        return new WebSocket<String>() {
            public void onReady(WebSocket.In<String> in, WebSocket.Out<String> out) {
                /*in.onMessage(new Callback<String>() {
                    public void invoke(String event) { … }
                });
                in.onClose(new Callback0() {
                    public void invoke() { … }
                });
                out.write("Hello!");*/
            }
        };
    }
}
