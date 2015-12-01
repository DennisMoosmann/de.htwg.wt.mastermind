package controllers;

import com.fasterxml.jackson.databind.JsonNode;
import de.htwg.se.mastermind.Mastermind;
import de.htwg.se.mastermind.controller.IController;
import com.fasterxml.jackson.databind.node.ObjectNode;
import play.libs.F;
import play.libs.Json;
import play.mvc.*;
//import play.mvc.WebSocket;
import java.math.BigInteger;
import java.security.SecureRandom;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * The MainController class creates an instance of the mastermind-controller which is implemented in
 * lib/de.htwg.se.mastermind jar-file. Through this controller it is possible to receive/manipulate
 * data of the mastermind-model.
 *
 * @author  Dennis Moosmann
 * @version 1.0
 * @since   2015-02-19
 */
public class MainController extends Controller {

    static IController controller = Mastermind.getInstance().getController();
    private static Helper helper = new Helper(controller);
    private static List<WebSocket.Out<String>> connections = new ArrayList<WebSocket.Out<String>>();

    /**
     * Renders the index.html file.
     * @return the rendered file.
     */
    public static Result index() {
        return ok(views.html.index.render("HTWG Mastermind", controller));
    }

    /**
     * Enables google+ authentication
     * @source https://github.com/michaelknoch/de.htwg.wt.go/blob/master/app/controllers/Application.java
     * @return Json-Object with client_id, state and application_name
     */
    public static Result auth() {
        final String CLIENT_ID = "723736591091-fqdhdi5d3eql2k1fqp6tlkd8id84b10l.apps.googleusercontent.com";
        final String APPLICATION_NAME = "Mastermind";

        String state = new BigInteger(130, new SecureRandom()).toString(32);
        session("state", state);

        Map map = new LinkedHashMap();
        map.put("client_id", CLIENT_ID);
        map.put("state", state);
        map.put("application_name", APPLICATION_NAME);
        return ok(Json.toJson(map));
    }

    /**
     * Used to get the actual game grid.
     * @return The game grid.
     */
    public static Result getGameGrid() {
        ObjectNode result = Json.newObject();
        String [][] field = helper.getGameField();
        result.put("gameGrid", Json.toJson(field));
        return ok(result);
    }

    /**
     * Used to get the actual stick grid
     * @return The stick grid.
     */
    public static Result getStickGrid() {
        ObjectNode result = Json.newObject();
        String [][] field = helper.getStickGrid();
        result.put("stickGrid", Json.toJson(field));
        return ok(result);
    }

    /**
     * Sets a value at [row][column] of the actual game-grid.
     * @param row The row were to set the value.
     * @param column The column where to set the value.
     * @param value The value to set.
     * @return Nothing.
     */
    public static Result setValue(int row, int column, String value) {
        controller.setValue(row, column, value);
        return ok();
    }

    /**
     * Increases or decreases the size of the game-field.
     * @param rows The new amount of rows.
     * @param columns The new amount of columns.
     * @return Nothing.
     */
    public static Result resetSize(int rows, int columns) {
        controller.resetSize(rows, columns);
        return ok();
    }

    /**
     * Confirms the actual row.
     * @return A Json-Object if row is confirmed, game is solved and with the actual row.
     */
    public static Result confirmRow() {
        controller.confirmRow();
        String [] conf = new String[3];
        conf[0] = String.valueOf(controller.getRowConfirmed());
        conf[1] = String.valueOf(controller.isSolved());
        conf[2] = String.valueOf(controller.getActualRow());

        ObjectNode result = Json.newObject();
        result.put("conf", Json.toJson(conf));

        return ok(result);
    }

    /**
     * Used to get the mastermind-colors.
     * @return The mastermind-colors.
     */
    public static Result getMastermindColors() {
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

    /**
     * Shows the solution of the hidden mastermind-colors.
     * @return The solution.
     */
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

    /**
     * Used to get the rows amount of the game-grid.
     * @return The rows amount of the game-grid.
     */
    public static Result getRowsAmount() {
        int rowsAmount = controller.getRowsAmount();
        return ok(String.valueOf(rowsAmount));
    }

    /**
     * Used to get the columns amount of the game-grid.
     * @return The columns amount of the game grid.
     */
    public static Result getColumnsAmount() {
        int columnsAmount = controller.getColumnsAmount();
        return ok(String.valueOf(columnsAmount));
    }

    /**
     * Used to get the actual row.
     * @return The actual row.
     */
    public static Result getActualRow() {
        int actualRow = controller.getActualRow();
        return ok(String.valueOf(actualRow));
    }

    /**
     * Used to get the color of a string value.
     * @param color The color as string.
     * @return The color as color class.
     */
    /*public static Result getColorFromString(String color) {
        if (color.equals("-")) {
            color = null;
        }
        Color c = controller.getColorFromString(color);
        return ok(String.valueOf(c));
    }*/

    /**
     * Used to get the status of the game.
     * @return The status of the game.
     */
    public static Result getStatus() {
        String state = controller.getStatusLine();
        return ok(state);
    }

    /**
     * Creates new mastermind game.
     * @return Nothing.
     */
    public static Result newGame() {
        int rowsAmount = controller.getRowsAmount();
        int columnsAmount = controller.getColumnsAmount();
        controller.create(rowsAmount, columnsAmount);
        return ok();
    }

    /**
     * Checks if the game is solved.
     * @return True if solved, false if not.
     */
    public static Result isSolved() {
        boolean isSolved = controller.isSolved();
        return ok(String.valueOf(isSolved));
    }

    public static Result signIn(String mail, String password) {
        return ok();
    }

    public static WebSocket<String> connectWebSocket() {
        return new WebSocket<String>() {
            public void onReady(WebSocket.In<String> in, WebSocket.Out<String> out) {
                connections.add(out);
                in.onMessage(new F.Callback<String>() {
                    public void invoke(String event) {
                        ObjectNode result = Json.newObject();
                        String [][] game = helper.getGameField();
                        result.put("gameGrid", Json.toJson(game));
                        String [][] sticks = helper.getStickGrid();
                        result.put("stickGrid", Json.toJson(sticks));
                        for (WebSocket.Out<String> out : connections) {
                            out.write(result.toString());
                        }
                    }
                });
            }
        };
    }
}
