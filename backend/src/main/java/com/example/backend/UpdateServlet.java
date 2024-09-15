package com.example.backend;

import org.json.JSONObject;
import org.json.JSONArray;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;

@WebServlet("/updateOrder")
public class UpdateServlet extends HttpServlet {
    protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String filePath = "/Users/dirgh/Desktop/Backend/backend/src/main/resources/data.json";
        StringBuilder sb = new StringBuilder();
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Failed to read the file.\"}");
            return;
        }

        JSONArray orders;
        try {
            orders = new JSONArray(sb.toString());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Failed to parse the JSON data.\"}");
            return;
        }

        StringBuilder reqBody = new StringBuilder();
        try (BufferedReader reqReader = request.getReader()) {
            String line;
            while ((line = reqReader.readLine()) != null) {
                reqBody.append(line);
            }
        }

        JSONObject requestBody;
        try {
            requestBody = new JSONObject(reqBody.toString());
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"Invalid JSON format.\"}");
            return;
        }
        String orderID;
        String newStatus;
        try {
            orderID = requestBody.getString("orderID");
            newStatus = requestBody.getString("status");
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("{\"error\": \"'orderID' or 'status' field missing.\"}");
            return;
        }

        boolean orderFound = false;

        for (int i = 0; i < orders.length(); i++) {
            JSONObject order = orders.getJSONObject(i);
            if (order.getString("orderID").equals(orderID)) {
                order.put("status", newStatus);
                orderFound = true;
                break;
            }
        }

        if (!orderFound) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("{\"error\": \"Order not found.\"}");
            return;
        }

        try (FileWriter fileWriter = new FileWriter(filePath)) {
            fileWriter.write(orders.toString(4));
            fileWriter.flush();
        } catch (IOException e) {
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Failed to update the file.\"}");
            return;
        }

        response.setContentType("application/json");
        response.getWriter().write("{\"message\":\"Order status updated successfully.\"}");
    }
}
