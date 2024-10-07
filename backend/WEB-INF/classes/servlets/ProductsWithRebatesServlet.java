import java.io.IOException;
import java.io.PrintWriter;
import java.sql.SQLException;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import model.Product;
import utilities.MySQLDataStoreUtilities;

@WebServlet("/inventory/rebates")
public class ProductsWithRebatesServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        PrintWriter out = response.getWriter();
        
        try {
            MySQLDataStoreUtilities dbUtilities = new MySQLDataStoreUtilities();
            List<Product> productsWithRebates = dbUtilities.getProductsWithRebates();
            String jsonProductsWithRebates = convertToJSON(productsWithRebates);
            out.print(jsonProductsWithRebates);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            out.print("{\"error\": \"Error fetching products with rebates\"}");
            e.printStackTrace();
        }
        out.flush();
    }

    private String convertToJSON(List<Product> products) {
        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < products.size(); i++) {
            Product product = products.get(i);
            json.append("{");
            json.append("\"id\":").append(product.getId()).append(",");
            json.append("\"name\":\"").append(escapeJSON(product.getName())).append("\",");
            json.append("\"price\":").append(product.getPrice()).append(",");
            json.append("\"manufacturerRebate\":").append(product.getManufacturerRebates());
            json.append("}");
            if (i < products.size() - 1) {
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