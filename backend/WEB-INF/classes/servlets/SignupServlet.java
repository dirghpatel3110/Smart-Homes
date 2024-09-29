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

@WebServlet("/signup")
public class SignupServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String contentType = req.getContentType();
        String name = "";
        String email = "";
        String password = "";
        String role = "";
        String userAge = "";
        String userGender = "";
        String street = "";
        String city = "";
        String state = "";
        String zipCode = "";

        if (contentType != null && contentType.equals("application/json")) {
            BufferedReader reader = req.getReader();
            StringBuilder jsonBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuilder.append(line);
            }
            String json = jsonBuilder.toString();
            JSONObject jsonObject = new JSONObject(json);
            name = jsonObject.getString("name");
            email = jsonObject.getString("email");
            password = jsonObject.getString("password");
            role = jsonObject.getString("role");
            userAge = jsonObject.getString("userAge");
            userGender = jsonObject.getString("userGender");
            street = jsonObject.getString("street");
            city = jsonObject.getString("city");
            state = jsonObject.getString("state");
            zipCode = jsonObject.getString("zipCode");
        } else {
            name = req.getParameter("name");
            email = req.getParameter("email");
            password = req.getParameter("password");
            role = req.getParameter("role");
            userAge = req.getParameter("userAge");
            userGender = req.getParameter("userGender");
            street = req.getParameter("street");
            city = req.getParameter("city");
            state = req.getParameter("state");
            zipCode = req.getParameter("zipCode");
        }

        try {
            if (dataStore.getUserByEmail(email) != null) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                resp.getWriter().write("Email already exists.");
                return;
            }

            User newUser = new User();
            newUser.setName(name);
            newUser.setEmail(email);
            newUser.setPassword(password);
            newUser.setRole(role);
            if (userAge != null && !userAge.isEmpty()) {
                try {
                    int age = Integer.parseInt(userAge);
                    newUser.setUserAge(age);
                } catch (NumberFormatException e) {
                    resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                    resp.getWriter().write("Invalid age format.");
                    return;
                }
            }
            newUser.setUserGender(userGender);
            newUser.setStreet(street);
            newUser.setCity(city);
            newUser.setState(state);
            newUser.setZipCode(zipCode);

            dataStore.addUser(newUser);

            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("User registered successfully.");
        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Error registering user: " + e.getMessage());
        }
    }
}