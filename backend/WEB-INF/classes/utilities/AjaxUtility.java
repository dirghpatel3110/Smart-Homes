package utilities;

import model.Product;
import java.sql.*;
import java.util.*; 

public class AjaxUtility {
    private static final String jdbcURL = "jdbc:mysql://localhost:3306/SmartHomes";
    private static final String jdbcUsername = "root";
    private static final String jdbcPassword = "Dp@95108";

    public static HashMap<String, Product> readProducts() {
        HashMap<String, Product> products = new HashMap<String, Product>();
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            Connection conn = DriverManager.getConnection(jdbcURL, jdbcUsername, jdbcPassword);
            String selectQuery = "SELECT id, name FROM products";
            PreparedStatement pst = conn.prepareStatement(selectQuery);
            ResultSet rs = pst.executeQuery();

            while(rs.next()) {
                Product product = new Product();
                product.setId(rs.getInt("id"));
                product.setName(rs.getString("name"));
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

    public static String readProductsAutocomplete(String searchId) {
    StringBuilder sb = new StringBuilder();
    try {
        HashMap<String, Product> products = readProducts();
        for(Map.Entry<String, Product> entry : products.entrySet()) {
            if(entry.getKey().toLowerCase().contains(searchId.toLowerCase())) {
                sb.append(entry.getValue().getId()).append(",");
                sb.append(entry.getValue().getName()).append("\n");
            }
        }
    } catch(Exception e) {
        e.printStackTrace();
    }
    return sb.toString();
}
}