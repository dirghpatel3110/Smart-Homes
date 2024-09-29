package servlets;

import model.Cart;
import model.Accessory;
import utilities.MySQLDataStoreUtilities;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;
import java.util.ArrayList;

@WebServlet("/cart")
public class CartServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String userIdParam = req.getParameter("userId");
        
        if (userIdParam == null || userIdParam.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("userId parameter is required");
            return;
        }
        
        int userId;
        try {
            userId = Integer.parseInt(userIdParam);
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Invalid userId format");
            return;
        }

        try {
            List<Cart> cartItems = dataStore.getCartItems(userId);
            JSONArray cartArray = new JSONArray();
            for (Cart item : cartItems) {
                JSONObject cartItemJson = new JSONObject();
                cartItemJson.put("id", item.getId());
                cartItemJson.put("productId", item.getProductId());
                cartItemJson.put("productName", item.getProductName());
                cartItemJson.put("quantity", item.getQuantity());
                cartItemJson.put("price", item.getPrice());
                cartItemJson.put("category", item.getCategory());
                cartItemJson.put("warranty", item.getWarranty());
                cartItemJson.put("discount", item.getDiscount());
                JSONArray accessoriesArray = new JSONArray();
                if (item.getAccessories() != null) {
                    for (Accessory accessory : item.getAccessories()) {
                        JSONObject accessoryJson = new JSONObject();
                        accessoryJson.put("id", accessory.getId());
                        accessoryJson.put("name", accessory.getName());
                        accessoryJson.put("description", accessory.getDescription());
                        accessoryJson.put("price", accessory.getPrice());
                        accessoryJson.put("quantity", accessory.getQuantity());
                        accessoriesArray.put(accessoryJson);
                    }
                }
                cartItemJson.put("accessories", accessoriesArray);
                
                cartArray.put(cartItemJson);
            }
            resp.setContentType("application/json");
            resp.getWriter().write(cartArray.toString());
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Error retrieving cart items: " + e.getMessage());
        }
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        StringBuilder jsonBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            jsonBuilder.append(line);
        }
        String json = jsonBuilder.toString();
        JSONObject cartItemJson = new JSONObject(json);

        Cart cartItem = new Cart();
        cartItem.setUserId(cartItemJson.getInt("userId"));
        cartItem.setProductId(cartItemJson.getInt("productId"));
        cartItem.setProductName(cartItemJson.getString("productName"));
        cartItem.setQuantity(cartItemJson.getInt("quantity"));
        cartItem.setPrice(cartItemJson.getDouble("price"));
        cartItem.setCategory(cartItemJson.getString("category"));
        cartItem.setWarranty(cartItemJson.getDouble("warranty"));
        cartItem.setDiscount(cartItemJson.getDouble("discount"));
        if (cartItemJson.has("accessories")) {
            JSONArray accessoriesArray = cartItemJson.getJSONArray("accessories");
            List<Accessory> accessories = new ArrayList<>();
            for (int i = 0; i < accessoriesArray.length(); i++) {
                JSONObject accessoryJson = accessoriesArray.getJSONObject(i);
                Accessory accessory = new Accessory();
                accessory.setId(accessoryJson.getInt("id"));
                accessory.setName(accessoryJson.getString("name"));
                accessory.setDescription(accessoryJson.getString("description"));
                accessory.setPrice(accessoryJson.getDouble("price"));
                accessory.setQuantity(accessoryJson.getInt("quantity"));
                accessories.add(accessory);
            }
            cartItem.setAccessories(accessories);
        }

        try {
            dataStore.addToCart(cartItem);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("Item added to cart successfully.");
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Error adding item to cart: " + e.getMessage());
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        StringBuilder jsonBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            jsonBuilder.append(line);
        }
        String json = jsonBuilder.toString();
        JSONObject updateJson = new JSONObject(json);

        int cartItemId = updateJson.getInt("cartItemId");
        int newQuantity = updateJson.getInt("quantity");

        try {
            dataStore.updateCartItem(cartItemId, newQuantity);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("Cart item updated successfully.");
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Error updating cart item: " + e.getMessage());
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String cartItemIdParam = req.getParameter("cartItemId");
        
        if (cartItemIdParam == null || cartItemIdParam.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("cartItemId parameter is required");
            return;
        }
        
        int cartItemId;
        try {
            cartItemId = Integer.parseInt(cartItemIdParam);
        } catch (NumberFormatException e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Invalid cartItemId format");
            return;
        }

        try {
            dataStore.removeFromCart(cartItemId);
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.getWriter().write("Item removed from cart successfully.");
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Error removing item from cart: " + e.getMessage());
        }
    }
}

