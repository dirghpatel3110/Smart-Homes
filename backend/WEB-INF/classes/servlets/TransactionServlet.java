package servlets;

import model.Transaction;
import utilities.MySQLDataStoreUtilities;
import org.json.JSONObject;
import org.json.JSONArray;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.Date;
import java.util.UUID;

@WebServlet("/transaction")
public class TransactionServlet extends HttpServlet {

private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();
@Override
protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    BufferedReader reader = req.getReader();
    StringBuilder jsonBuilder = new StringBuilder();
    String line;
    while ((line = reader.readLine()) != null) {
        jsonBuilder.append(line);
    }
    String json = jsonBuilder.toString();
    JSONObject transactionJson = new JSONObject(json);

    int userId = transactionJson.getInt("userId");
    String customerName = transactionJson.getString("customerName");
    String creditCardNumber = transactionJson.getString("creditCardNumber");
    double totalSales = transactionJson.getDouble("totalSales");
    String deliveryOption = transactionJson.getString("deliveryOption");

    JSONArray productsArray = transactionJson.getJSONArray("products");
    for (int i = 0; i < productsArray.length(); i++) {
        JSONObject productJson = productsArray.getJSONObject(i);

        String uniqueOrderId = UUID.randomUUID().toString();

        Transaction transaction = new Transaction();
        transaction.setUserId(userId);
        transaction.setCustomerName(customerName);
        transaction.setCreditCardNumber(creditCardNumber);
        transaction.setOrderId(uniqueOrderId); 
        transaction.setPurchaseDate(new Date());
        transaction.setDeliveryDate(new Date(System.currentTimeMillis() + 15L * 24 * 60 * 60 * 1000)); // 15 days later
        transaction.setTotalSales(totalSales);
        transaction.setDeliveryOption(deliveryOption);

        if ("home_delivery".equals(deliveryOption)) {
            transaction.setStreet(transactionJson.getString("street"));
            transaction.setCity(transactionJson.getString("city"));
            transaction.setState(transactionJson.getString("state"));
            transaction.setZipCode(transactionJson.getString("zipCode"));
            transaction.setShippingCost(5.0);
        } else {
            transaction.setStoreStreet(transactionJson.getString("storeStreet"));
            transaction.setStoreCity(transactionJson.getString("storeCity"));
            transaction.setStoreState(transactionJson.getString("storeState"));
            transaction.setStoreZip(transactionJson.getString("storeZip"));
            transaction.setStoreId(transactionJson.getInt("storeId"));
            transaction.setShippingCost(0.0); 
        }

        transaction.setProductId(productJson.getInt("productId"));
        transaction.setCategory(productJson.getString("category"));
        transaction.setQuantity(productJson.getInt("quantity"));
        transaction.setPrice(productJson.getDouble("price"));
        transaction.setDiscount(productJson.getDouble("discount"));

        transaction.setOrderStatus("Order Placed");

        try {
            dataStore.addTransaction(transaction);
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Error adding transaction: " + e.getMessage());
            return;
        }
    }

    resp.setStatus(HttpServletResponse.SC_CREATED);
    JSONObject responseJson = new JSONObject();
    responseJson.put("message", "All transactions added successfully.");
    resp.setContentType("application/json");
    resp.getWriter().write(responseJson.toString());
}
}