package com.example.backend;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;
import java.util.stream.Collectors;
import org.json.JSONArray;
import org.json.JSONObject;

@WebServlet("/deleteProduct")
public class DeleteProductServlet extends HttpServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String productIdParam = request.getParameter("id");
        if (productIdParam == null || productIdParam.isEmpty()) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Product ID is required.");
            return;
        }

        try {
            int productId = Integer.parseInt(productIdParam);

            String filePath = getServletContext().getRealPath("/WEB-INF/products.json");

            StringBuilder jsonBuilder = new StringBuilder();
            try (InputStream inputStream = Files.newInputStream(Paths.get(filePath));
                 BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream))) {
                String line;
                while ((line = reader.readLine()) != null) {
                    jsonBuilder.append(line);
                }
            }

            JSONArray products = new JSONArray(jsonBuilder.toString());

            List<JSONObject> updatedProducts = products.toList().stream()
                    .map(obj -> new JSONObject((java.util.Map<?, ?>) obj))
                    .filter(product -> product.getInt("id") != productId)
                    .collect(Collectors.toList());

            if (updatedProducts.size() == products.length()) {
                response.sendError(HttpServletResponse.SC_NOT_FOUND, "Product not found.");
                return;
            }

            try (OutputStream outputStream = Files.newOutputStream(Paths.get(filePath))) {
                outputStream.write(new JSONArray(updatedProducts).toString(2).getBytes());
            }

            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter().println("Product deleted successfully.");

        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid Product ID format.");
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "An error occurred while processing the request.");
        }
    }
}
