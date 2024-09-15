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
import java.nio.file.StandardOpenOption;
import java.io.File;

@WebServlet("/signup")
public class SignupServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String contentType = req.getContentType();
        String name = "";
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
            name = jsonObject.getString("name");
            email = jsonObject.getString("email");
            password = jsonObject.getString("password");
            role = jsonObject.getString("role");
        } else {
            name = req.getParameter("name");
            email = req.getParameter("email");
            password = req.getParameter("password");
            role = req.getParameter("role");
        }
        String filePath = "/Users/dirgh/Desktop/Backend/backend/src/main/resources/Users.json";
        System.out.println("JSON file path: " + filePath);

        File file = new File(filePath);

        if (!file.exists()) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Users.json file not found");
            return;
        }
        String content = new String(Files.readAllBytes(Paths.get(filePath)));
        JSONArray usersArray = new JSONArray(content);
        for (int i = 0; i < usersArray.length(); i++) {
            JSONObject user = usersArray.getJSONObject(i);
            if (user.getString("email").equals(email)) {
                resp.setStatus(HttpServletResponse.SC_CONFLICT);
                resp.getWriter().write("Email already exists.");
                return;
            }
        }
        JSONObject newUser = new JSONObject();
        newUser.put("name", name);
        newUser.put("email", email);
        newUser.put("password", password);
        newUser.put("role", role);
        usersArray.put(newUser);
        Files.write(Paths.get(filePath), usersArray.toString().getBytes(), StandardOpenOption.WRITE, StandardOpenOption.TRUNCATE_EXISTING);
        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.getWriter().write("User registered successfully.");
    }
}
