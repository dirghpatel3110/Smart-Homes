package com.example.backend;
import java.io.*;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import org.json.JSONArray;
import org.json.JSONObject;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.UUID;

@WebServlet("/storedata")
public class StoreDataServlet extends HttpServlet {
    private static final String FILE_PATH = "/Users/dirgh/Desktop/Backend/backend/src/main/resources/data.json";

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json");
        StringBuilder jsonData = new StringBuilder();
        String line;
        try (BufferedReader reader = request.getReader()) {
            while ((line = reader.readLine()) != null) {
                jsonData.append(line);
            }
        }
        JSONObject newEntry = new JSONObject(jsonData.toString());
        String orderID = UUID.randomUUID().toString();
        String status = "Order Placed";
        newEntry.put("orderID", orderID);
        newEntry.put("status", status);
        JSONArray jsonArray;
        try {
            String existingData = new String(Files.readAllBytes(Paths.get(FILE_PATH)));
            jsonArray = new JSONArray(existingData);
        } catch (IOException e) {
            jsonArray = new JSONArray();
        }
        jsonArray.put(newEntry);

        try (FileWriter fileWriter = new FileWriter(FILE_PATH)) {
            fileWriter.write(jsonArray.toString(4));
        } catch (IOException e) {
            e.printStackTrace();
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("{\"error\": \"Failed to write to the file.\"}");
            return;
        }

        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("{\"message\": \"Data stored successfully.\", \"orderID\": \"" + orderID + "\"}");
    }
}
