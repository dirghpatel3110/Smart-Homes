package servlets;

import model.Transaction;
import utilities.MySQLDataStoreUtilities;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/getTransactions")
public class GetTransactionServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String userIdParam = request.getParameter("userId");

        try {
            if (userIdParam != null) {
                int userId = Integer.parseInt(userIdParam);
                List<Transaction> transactions = dataStore.getTransactionsByUserId(userId);
                writeResponse(response, transactions);
            } else {
                List<Transaction> transactions = dataStore.getAllTransactions();
                writeResponse(response, transactions);
            }
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid userId format.\"}");
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Error retrieving transactions: " + e.getMessage() + "\"}");
        }
    }

    private void writeResponse(HttpServletResponse response, List<Transaction> transactions) throws IOException {
        JSONArray transactionArray = new JSONArray();
        for (Transaction transaction : transactions) {
            JSONObject transactionJson = new JSONObject();
            transactionJson.put("orderId", transaction.getOrderId());
            transactionJson.put("userId", transaction.getUserId());
            transactionJson.put("customerName", transaction.getCustomerName());
            transactionJson.put("creditCardNumber", transaction.getCreditCardNumber());
            transactionJson.put("purchaseDate", transaction.getPurchaseDate().toString());
            transactionJson.put("deliveryDate", transaction.getDeliveryDate().toString());
            transactionJson.put("totalSales", transaction.getTotalSales());
            transactionJson.put("deliveryOption", transaction.getDeliveryOption());
            transactionJson.put("orderStatus", transaction.getOrderStatus());
            transactionArray.put(transactionJson);
        }
        response.getWriter().write(transactionArray.toString());
    }
}



