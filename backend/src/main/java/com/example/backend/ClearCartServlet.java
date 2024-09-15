package com.example.backend;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;

@WebServlet("/clearCart")
public class ClearCartServlet extends HttpServlet {

    @Override
    protected void doDelete(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String email = request.getParameter("email");

        if (email == null || email.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.getWriter().write("Email parameter is missing.");
            return;
        }

        String cartFilePath = "/Users/dirgh/Desktop/Backend/backend/src/main/resources/cart.json";
        JSONArray cartArray;

        try (FileReader reader = new FileReader(cartFilePath)) {
            cartArray = new JSONArray(new JSONTokener(reader));
        } catch (IOException e) {
            e.printStackTrace(); // Log the exception for debugging
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error reading cart file: " + e.getMessage());
            return;
        }

        boolean cartRemoved = false;
        for (int i = 0; i < cartArray.length(); i++) {
            JSONObject cartObject = cartArray.getJSONObject(i);
            if (cartObject.getString("email").equalsIgnoreCase(email)) {
                cartArray.remove(i); // Remove the cart entry
                cartRemoved = true;
                break;
            }
        }

        if (!cartRemoved) {
            response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            response.getWriter().write("Cart not found for email: " + email);
            return;
        }

        try (FileWriter fileWriter = new FileWriter(cartFilePath, false)) {
            fileWriter.write(cartArray.toString(4)); // Pretty-print JSON with indentation
            fileWriter.flush();
        } catch (IOException e) {
            e.printStackTrace(); // Log the exception for debugging
            response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            response.getWriter().write("Error updating cart file: " + e.getMessage());
            return;
        }

        response.setStatus(HttpServletResponse.SC_OK);
        response.getWriter().write("Cart removed successfully for email: " + email);
    }
}
