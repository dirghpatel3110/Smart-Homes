package servlets;

import utilities.MySQLDataStoreUtilities;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/deleteOrder")
public class DeleteOrderServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String orderID = request.getParameter("orderID");
        if (orderID == null || orderID.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"message\":\"OrderID parameter is missing.\"}");
            return;
        }

        try {
            boolean isDeleted = dataStore.deleteOrder(orderID); 

            if (!isDeleted) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"message\":\"Order not found.\"}");
                return;
            }

            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Order deleted successfully.\"}");

        } catch (SQLException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\":\"An error occurred while processing the request.\"}");
        }
    }
}
