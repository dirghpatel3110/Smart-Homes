package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.json.JSONArray;
import org.json.JSONObject;
import utilities.MySQLDataStoreUtilities;

@WebServlet("/ProductSalesReportServlet")
public class ProductSalesReportServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            List<Map<String, Object>> salesReport = dataStore.getProductSalesReport();
            JSONArray jsonArray = new JSONArray();
            
            for (Map<String, Object> productSales : salesReport) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("productId", productSales.get("productId"));
                jsonObject.put("productName", productSales.get("productName"));
                jsonObject.put("price", productSales.get("price"));
                jsonObject.put("totalItemsSold", productSales.get("totalItemsSold"));
                jsonObject.put("totalSales", productSales.get("totalSales"));
                jsonArray.put(jsonObject); 

                // Update product inventory
                int productId = (int) productSales.get("productId");
                int totalItemsSold = (int) productSales.get("totalItemsSold");
                // dataStore.updateProductInventory(productId, totalItemsSold);
            }
            
            out.print(jsonArray.toString());
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Error fetching product sales report\"}");
            e.printStackTrace();
        }
        out.flush();
    }
}