package servlets;

import model.Transaction; 
import utilities.MySQLDataStoreUtilities;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/updateOrder")
public class UpdateOrderServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        StringBuilder reqBody = new StringBuilder();
        try (BufferedReader reqReader = request.getReader()) {
            String line;
            while ((line = reqReader.readLine()) != null) {
                reqBody.append(line);
            }
        }    

        JSONObject requestBody;
        try {
            requestBody = new JSONObject(reqBody.toString());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid JSON format.\"}");
            return;
        }

        String orderID;
        String newStatus;
        try {
            orderID = requestBody.getString("orderID");
            newStatus = requestBody.getString("status");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"'orderID' or 'status' field missing.\"}");
            return;
        }

        Transaction transaction = new Transaction();
        transaction.setOrderId(orderID);
        transaction.setOrderStatus(newStatus);

        try {
            boolean isUpdated = dataStore.updateOrderStatus(transaction); 

            if (!isUpdated) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"error\": \"Order not found.\"}");
                return;
            }

            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Order status updated successfully.\"}");

        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Failed to update the order: " + e.getMessage() + "\"}");
        }
    }
}
