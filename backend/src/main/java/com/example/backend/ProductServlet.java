package com.example.backend;

import org.json.JSONArray;
import org.json.JSONObject;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

@WebServlet("/products")
public class ProductServlet extends HttpServlet {

    private String getProductsFilePath() {
        return "/Users/dirgh/Desktop/Backend/backend/src/main/resources/products.json";
    }

    private JSONObject readProductsFile() throws IOException {
        String filePath = getProductsFilePath();
        File file = new File(filePath);

        if (!file.exists()) {
            return new JSONObject();
        }
        String content = new String(Files.readAllBytes(Paths.get(filePath)));
        return new JSONObject(content);
    }

    private void writeProductsFile(JSONObject products) throws IOException {
        String filePath = getProductsFilePath();
        Files.write(Paths.get(filePath), products.toString(4).getBytes());
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        JSONObject productsObject = readProductsFile();
        resp.setContentType("application/json");
        resp.getWriter().write(productsObject.toString());
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        BufferedReader reader = req.getReader();
        StringBuilder jsonBuilder = new StringBuilder();
        String line;
        while ((line = reader.readLine()) != null) {
            jsonBuilder.append(line);
        }
        String json = jsonBuilder.toString();
        JSONObject newProduct = new JSONObject(json);
        String category = newProduct.getString("category");
        JSONObject productsObject = readProductsFile();
        JSONArray productsArray = productsObject.optJSONArray(category);
        if (productsArray == null) {
            productsArray = new JSONArray();
            productsObject.put(category, productsArray);
        }
        int highestId = 0;
        for (int i = 0; i < productsArray.length(); i++) {
            JSONObject product = productsArray.getJSONObject(i);
            int id = product.getInt("id");
            if (id > highestId) {
                highestId = id;
            }
        }

        int newId = highestId + 1;
        newProduct.put("id", newId);
        productsArray.put(newProduct);
        writeProductsFile(productsObject);
        resp.setStatus(HttpServletResponse.SC_CREATED);
        resp.getWriter().write("Product added successfully with ID: " + newId);
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            BufferedReader reader = req.getReader();
            StringBuilder jsonBuilder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                jsonBuilder.append(line);
            }
            String json = jsonBuilder.toString();
            JSONObject updatedProduct = new JSONObject(json);
            String category = updatedProduct.getString("category");
            JSONObject productsObject = readProductsFile();
            JSONArray productsArray = productsObject.optJSONArray(category);

            if (productsArray == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("Category not found.");
                return;
            }
            boolean productFound = false;
            int productId = updatedProduct.getInt("id");

            for (int i = 0; i < productsArray.length(); i++) {
                JSONObject product = productsArray.getJSONObject(i);
                if (product.getInt("id") == productId) {
                    productsArray.put(i, updatedProduct);
                    productFound = true;
                    break;
                }
            }

            if (productFound) {
                writeProductsFile(productsObject);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("Product updated successfully.");
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("Product not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Error updating product.");
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            int productId = Integer.parseInt(req.getParameter("id"));
            String category = req.getParameter("category");
            JSONObject productsObject = readProductsFile();
            JSONArray productsArray = productsObject.optJSONArray(category);

            if (productsArray == null) {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("Category not found.");
                return;
            }
            boolean productFound = false;
            for (int i = 0; i < productsArray.length(); i++) {
                JSONObject product = productsArray.getJSONObject(i);
                if (product.getInt("id") == productId) {
                    productsArray.remove(i);
                    productFound = true;
                    break;
                }
            }

            if (productFound) {
                writeProductsFile(productsObject);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("Product deleted successfully.");
            } else {
                resp.setStatus(HttpServletResponse.SC_NOT_FOUND);
                resp.getWriter().write("Product not found.");
            }
        } catch (Exception e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Error deleting product.");
        }
    }
}



