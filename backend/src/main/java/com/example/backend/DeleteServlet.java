package com.example.backend;

import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.*;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/deleteOrder")
public class DeleteServlet extends HttpServlet {
    private static final long serialVersionUID = 1L;

    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        // File path to your data.json
        String filePath = "/Users/dirgh/Desktop/Backend/backend/src/main/resources/data.json";

        try {
            File file = new File(filePath);
            if (!file.exists()) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"message\":\"File not found.\"}");
                return;
            }

            BufferedReader reader = new BufferedReader(new FileReader(file));
            StringBuilder sb = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                sb.append(line);
            }
            reader.close();

            JSONArray orders = new JSONArray(sb.toString());

            String orderID = request.getParameter("orderID");
            if (orderID == null || orderID.isEmpty()) {
                response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                response.getWriter().write("{\"message\":\"OrderID parameter is missing.\"}");
                return;
            }

            boolean deleted = false;
            for (int i = 0; i < orders.length(); i++) {
                JSONObject order = orders.getJSONObject(i);
                if (order.getString("orderID").equals(orderID)) {
                    orders.remove(i);
                    deleted = true;
                    break;
                }
            }

            if (!deleted) {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                response.getWriter().write("{\"message\":\"Order not found.\"}");
                return;
            }

            FileWriter fileWriter = new FileWriter(file);
            fileWriter.write(orders.toString(4));
            fileWriter.close();

            response.setContentType("application/json");
            response.getWriter().write("{\"message\":\"Order deleted successfully.\"}");

        } catch (IOException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"message\":\"An error occurred while processing the request.\"}");
        }
    }
}
