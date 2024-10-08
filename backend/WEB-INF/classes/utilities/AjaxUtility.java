package utilities;

import model.Product;
import java.sql.*;
import java.util.*;
import org.json.JSONArray;
import org.json.JSONObject;

public class AjaxUtility {
    private static final String jdbcURL = "jdbc:mysql://localhost:3306/SmartHomes";
    private static final String jdbcUsername = "root";
    private static final String jdbcPassword = "Dp@95108";

    public static HashMap<String, Product> readProducts() {
        HashMap<String, Product> products = new HashMap<String, Product>();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(jdbcURL, jdbcUsername, jdbcPassword);
            String selectQuery = "SELECT * FROM products";
            PreparedStatement pst = conn.prepareStatement(selectQuery);
            ResultSet rs = pst.executeQuery();

            while(rs.next()) {
                Product product = new Product();
                product.setId(rs.getInt("id"));
                product.setName(rs.getString("name"));
                product.setDescription(rs.getString("description"));
                product.setPrice(rs.getDouble("price"));
                product.setRetailerSpecialDiscounts(rs.getDouble("retailer_special_discounts"));
                product.setManufacturerRebates(rs.getDouble("manufacturer_rebates"));
                product.setWarrantyPrice(rs.getDouble("warranty_price"));
                product.setCategory(rs.getString("category"));
                product.setLikes(rs.getInt("likes"));
                products.put(product.getName().toLowerCase(), product);
            }
            rs.close();
            pst.close();
            conn.close();
        } catch(Exception e) {
            e.printStackTrace();
        }
        return products;
    }

    public static JSONArray readProductsAutocomplete(String searchId) {
        JSONArray jsonArray = new JSONArray();
        try {
            HashMap<String, Product> products = readProducts();
            for(Map.Entry<String, Product> entry : products.entrySet()) {
                if(entry.getKey().toLowerCase().startsWith(searchId.toLowerCase())) {
                    JSONObject productJson = new JSONObject();
                    productJson.put("id", entry.getValue().getId());
                    productJson.put("name", entry.getValue().getName());
                    jsonArray.put(productJson);
                }
            }
        } catch(Exception e) {
            e.printStackTrace();
        }
        return jsonArray;
    }
}