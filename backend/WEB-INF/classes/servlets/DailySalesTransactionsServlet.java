package servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.sql.Date;  // Add this import
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

@WebServlet("/DailySalesTransactionsServlet")
public class DailySalesTransactionsServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            List<Map<String, Object>> dailySales = dataStore.getDailySalesTransactions();
            JSONArray jsonArray = new JSONArray();
             
            for (Map<String, Object> daySales : dailySales) {
                JSONObject jsonObject = new JSONObject();
                jsonObject.put("date", ((Date) daySales.get("date")).toString());
                jsonObject.put("totalSales", daySales.get("totalSales"));
                jsonArray.put(jsonObject);
            }
            
            out.print(jsonArray.toString());
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Error fetching daily sales transactions\"}");
            e.printStackTrace();
        }
        out.flush();
    }
}