package servlets;

import utilities.MySQLDataStoreUtilities;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/clearCart")
public class ClearCartServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String userIdParam = request.getParameter("userId");

        if (userIdParam == null || userIdParam.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("UserId parameter is missing.");
            return;
        }

        int userId;
        try {
            userId = Integer.parseInt(userIdParam);
        } catch (NumberFormatException e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Invalid userId format.");
            return;
        }

        try {
            dataStore.clearCart(userId);
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().write("Cart cleared successfully for userId: " + userId);
        } catch (SQLException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error clearing cart: " + e.getMessage());
        }
    }
}