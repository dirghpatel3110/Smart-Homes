package com.example.backend;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.File;

@WebServlet("/login")
public class LoginServlet extends HttpServlet {

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

        String filePath = "/Users/dirgh/Desktop/Backend/backend/src/main/resources/Users.json";

        File file = new File(filePath);

        if (!file.exists()) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Users.json file not found");
            return;
        }

        String content = new String(Files.readAllBytes(Paths.get(filePath)));
        JSONArray usersArray = new JSONArray(content);

        boolean userFound = false;
        boolean roleMismatch = false;
        JSONObject userObject = null;

        for (int i = 0; i < usersArray.length(); i++) {
            JSONObject user = usersArray.getJSONObject(i);
            if (user.getString("email").equals(email) && user.getString("password").equals(password)) {
                userFound = true;
                userObject = user;
                if (!user.getString("role").equals(role)) {
                    roleMismatch = true;
                    break;
                }
            }
        }
        if (!userFound) {
            resp.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            resp.getWriter().write("Invalid email or password.");
        } else if (roleMismatch) {
            resp.setStatus(HttpServletResponse.SC_FORBIDDEN);
            resp.getWriter().write("Role mismatch.");
        } else {
            resp.setStatus(HttpServletResponse.SC_OK);
            resp.setContentType("application/json");
            resp.getWriter().write(userObject.toString());
        }
    }

}
