package com.example.backend;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

@WebServlet("/cart")
public class CartServlet extends HttpServlet {

    private static final String CART_FILE_PATH = "/Users/dirgh/Desktop/Backend/backend/src/main/resources/cart.json";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String email = req.getParameter("email");

        if (email == null || email.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Email is required.");
            return;
        }

        JSONArray cartArray = readCartJson();

        JSONObject userCart = getUserCart(cartArray, email);

        resp.setContentType("application/json");
        resp.getWriter().write(userCart.toString());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        if (req.getContentType() == null || !req.getContentType().equals("application/json")) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Content-Type must be application/json");
            return;
        }

        StringBuilder jsonBuilder = new StringBuilder();
        try (BufferedReader reader = req.getReader()) {
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuilder.append(line);
            }
        }

        String jsonData = jsonBuilder.toString();
        JSONObject jsonObject;
        try {
            jsonObject = new JSONObject(jsonData);
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Invalid JSON format");
            return;
        }

        String email = jsonObject.optString("email");
        String action = jsonObject.optString("action");
        String productId = jsonObject.optString("productId");
        String accessories = jsonObject.optString("accessories");
        String category = jsonObject.optString("category");
        int quantity = jsonObject.optInt("quantity", 1);
        double price = jsonObject.optDouble("price", 0.0);
        String name = jsonObject.optString("name");
        JSONObject warranty = jsonObject.optJSONObject("warranty");

        if (email.isEmpty() || action.isEmpty()) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("Email and action are required.");
            return;
        }

        JSONArray cartArray = readCartJson();
        JSONObject userCart = getUserCart(cartArray, email);

        switch (action.toLowerCase()) {
            case "add":
                addToCart(userCart, productId, accessories, category, quantity, price, name, warranty);
                break;
            case "remove":
                removeFromCart(userCart, productId, category, quantity, name);
                break;
            case "list":
                resp.setContentType("application/json");
                resp.getWriter().write(userCart.toString());
                return;
            default:
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("Invalid action.");
                return;
        }

        writeCartJson(cartArray);
        resp.setStatus(HttpServletResponse.SC_OK);
        resp.getWriter().write("Cart updated successfully!");
    }

    private JSONArray readCartJson() throws IOException {
        File file = new File(CART_FILE_PATH);
        if (!file.exists()) return new JSONArray();

        try (BufferedReader reader = new BufferedReader(new FileReader(file))) {
            StringBuilder jsonContent = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonContent.append(line);
            }
            return new JSONArray(jsonContent.toString());
        }
    }

    private void writeCartJson(JSONArray cartArray) throws IOException {
        File file = new File(CART_FILE_PATH);
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file))) {
            writer.write(cartArray.toString());
        }
    }

    private JSONObject getUserCart(JSONArray cartArray, String email) {
        for (int i = 0; i < cartArray.length(); i++) {
            JSONObject cart = cartArray.getJSONObject(i);
            if (cart.getString("email").equals(email)) {
                return cart;
            }
        }

        JSONObject newCart = new JSONObject();
        newCart.put("email", email);
        newCart.put("products", new JSONArray());
        cartArray.put(newCart);
        return newCart;
    }

    private void addToCart(JSONObject userCart, String productId, String accessories, String category, int quantity, double price, String name, JSONObject warranty) {
        JSONArray products = userCart.getJSONArray("products");
        for (int i = 0; i < products.length(); i++) {
            JSONObject product = products.getJSONObject(i);
            if (product.getString("category").equals(category) && product.getString("name").equals(name)) {
                int currentQuantity = product.getInt("quantity");
                product.put("quantity", currentQuantity + quantity);
                return;
            }
        }

        JSONObject product = new JSONObject();
        product.put("productId", productId);
        product.put("quantity", quantity);
        product.put("price", price);
        product.put("name", name);
        product.put("warranty", warranty);

        if (accessories != null && !accessories.isEmpty()) {
            product.put("accessories", new JSONArray(accessories));
        }

        if (category != null && !category.isEmpty()) {
            product.put("category", category);
        }

        products.put(product);
    }

    private void removeFromCart(JSONObject userCart, String productId, String category, int quantity, String name) {
        JSONArray products = userCart.getJSONArray("products");
        for (int i = 0; i < products.length(); i++) {
            JSONObject product = products.getJSONObject(i);

            if (product.getString("productId").equals(productId)
                    && product.getString("category").equals(category)
                    && product.getString("name").equals(name)) {

                int currentQuantity = product.getInt("quantity");
                if (currentQuantity <= quantity) {
                    products.remove(i);
                } else {
                    product.put("quantity", currentQuantity - quantity);
                }
                break;
            }
        }
    }
}
