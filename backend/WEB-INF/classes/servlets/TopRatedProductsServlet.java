package servlets;

import utilities.MongoDBDataStoreUtilities;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;
import java.util.Map;

@WebServlet("/topRatedProducts")
public class TopRatedProductsServlet extends HttpServlet {
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            List<Map<String, Object>> topRatedProducts = MongoDBDataStoreUtilities.getTopRatedProducts(5);

            StringBuilder jsonResponse = new StringBuilder("[");
            for (int i = 0; i < topRatedProducts.size(); i++) {
                Map<String, Object> product = topRatedProducts.get(i);
                jsonResponse.append("{")
                    .append("\"ProductModelName\":\"").append(product.get("ProductModelName")).append("\",")
                    .append("\"AverageRating\":").append(product.get("AverageRating"))
                    .append("}");

                if (i < topRatedProducts.size() - 1) {
                    jsonResponse.append(",");
                }
            }
            jsonResponse.append("]");
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(jsonResponse.toString());
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error occurred.");
            e.printStackTrace();
        }
    }
}
