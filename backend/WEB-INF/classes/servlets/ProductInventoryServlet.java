package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.ProductInventory;
import utilities.MySQLDataStoreUtilities;

@WebServlet("/ProductInventoryServlet")
public class ProductInventoryServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            MySQLDataStoreUtilities dbUtilities = new MySQLDataStoreUtilities();
            List<ProductInventory> inventory = dbUtilities.getProductInventory();
            String jsonInventory = convertToJSON(inventory);
            out.print(jsonInventory);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Error fetching product inventory\"}");
            e.printStackTrace();
        }
        out.flush();
    }

    private String convertToJSON(List<ProductInventory> inventory) {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < inventory.size(); i++) {
            ProductInventory item = inventory.get(i);
            json.append("{");
            json.append("\"name\":\"").append(escapeJSON(item.getName())).append("\",");
            json.append("\"price\":").append(item.getPrice()).append(",");
            json.append("\"availableItems\":").append(item.getAvailableItems());
            json.append("}");
            if (i < inventory.size() - 1) {
                json.append(",");
            }
        }
        json.append("]");
        return json.toString();
    }

    private String escapeJSON(String input) {
        if (input == null) {
            return "";
        }
        return input.replace("\\", "\\\\")
                    .replace("\"", "\\\"")
                    .replace("\b", "\\b")
                    .replace("\f", "\\f")
                    .replace("\n", "\\n")
                    .replace("\r", "\\r")
                    .replace("\t", "\\t");
    }
}