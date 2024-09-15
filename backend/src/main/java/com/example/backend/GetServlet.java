package com.example.backend;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/getOrders")
public class GetServlet extends HttpServlet {

    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String filePath = "/Users/dirgh/Desktop/Backend/backend/src/main/resources/data.json";
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");

        String email = request.getParameter("email");

        File file = new File(filePath);
        BufferedReader reader = new BufferedReader(new FileReader(file));
        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line);
        }
        reader.close();

        JSONArray orders = new JSONArray(sb.toString());
        JSONArray filteredOrders = new JSONArray();

        if (email != null && !email.isEmpty()) {
            for (int i = 0; i < orders.length(); i++) {
                JSONObject order = orders.getJSONObject(i);
                if (order.getString("email").equals(email)) {
                    filteredOrders.put(order);
                }
            }
        } else {
            filteredOrders = orders;
        }
        response.getWriter().write(filteredOrders.toString());
    }
}
