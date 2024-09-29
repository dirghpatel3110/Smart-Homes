package servlets;

import model.User;
import utilities.MySQLDataStoreUtilities;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String contentType = req.getContentType();
        String email = "";
        String password = "";
        String role = "";
        

        if (contentType != null && contentType.equals("application/json")) {
            BufferedReader reader = req.getReader();
            StringBuilder jsonBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuilder.append(line);
            }
            String json = jsonBuilder.toString();
            JSONObject jsonObject = new JSONObject(json);
            email = jsonObject.getString("email");
            password = jsonObject.getString("password");
            role = jsonObject.getString("role");
        } else {
            email = req.getParameter("email");
            password = req.getParameter("password");
            role = req.getParameter("role");
        }

        try {
            User user = dataStore.authenticateUser(email, password);
            if (user == null) {
                resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                resp.getWriter().write("Invalid email or password.");
            } else if (!user.getRole().equals(role)) {
                resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
                resp.getWriter().write("Role mismatch.");
            } else {
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.setContentType("application/json");
                JSONObject userJson = new JSONObject();
                userJson.put("id", user.getId());
                userJson.put("name", user.getName());
                userJson.put("email", user.getEmail());
                userJson.put("role", user.getRole());
                userJson.put("userAge", user.getUserAge());
                userJson.put("userGender", user.getUserGender());
                resp.getWriter().write(userJson.toString());
            }
            System.out.println("User: " + user.getName() + ", Age: " + user.getUserAge() + ", Gender: " + user.getUserGender());
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Database error: " + e.getMessage());
        }
    }
}