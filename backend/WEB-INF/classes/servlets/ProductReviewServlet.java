package servlets;

import utilities.MongoDBDataStoreUtilities;
import javax.servlet.*;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.HashMap;

@WebServlet("/productReview")
public class ProductReviewServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        try {
            String productModelName = request.getParameter("ProductModelName");
            String productCategory = request.getParameter("ProductCategory");
            String productPriceStr = request.getParameter("ProductPrice");
            double productPrice = 0.0;
            System.out.println(productPriceStr);
            if (productPriceStr != null && !productPriceStr.isEmpty()) {
            productPrice = Double.parseDouble(productPriceStr);  
            } else {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Product price is missing or invalid.");
            return;
            }
            
            int storeID = Integer.parseInt(request.getParameter("StoreID"));
            System.out.println(storeID);
            int storeZip = Integer.parseInt(request.getParameter("StoreZip"));
            System.out.println(storeZip);
            String storeCity = request.getParameter("StoreCity");
            String storeState = request.getParameter("StoreState");
            boolean productOnSale = Boolean.parseBoolean(request.getParameter("ProductOnSale"));
            String manufacturerName = request.getParameter("ManufacturerName");
            boolean manufacturerRebate = Boolean.parseBoolean(request.getParameter("ManufacturerRebate"));
            int userID = Integer.parseInt(request.getParameter("UserID"));
            System.out.println(userID);
            int userAge = Integer.parseInt(request.getParameter("UserAge"));
            System.out.println(userAge);
            String userGender = request.getParameter("UserGender");
            String userOccupation = request.getParameter("UserOccupation");
            int reviewRating = Integer.parseInt(request.getParameter("ReviewRating"));
            System.out.println(reviewRating);
            String reviewDate = request.getParameter("ReviewDate");
            String reviewText = request.getParameter("ReviewText");

            HashMap<String, Object> reviewData = new HashMap<>();
            reviewData.put("ProductModelName", productModelName);
            reviewData.put("ProductCategory", productCategory);
            reviewData.put("ProductPrice", productPrice);
            reviewData.put("StoreID", storeID);
            reviewData.put("StoreZip", storeZip);
            reviewData.put("StoreCity", storeCity);
            reviewData.put("StoreState", storeState);
            reviewData.put("ProductOnSale", productOnSale);
            reviewData.put("ManufacturerName", manufacturerName);
            reviewData.put("ManufacturerRebate", manufacturerRebate);
            reviewData.put("UserID", userID);
            reviewData.put("UserAge", userAge);
            reviewData.put("UserGender", userGender);
            reviewData.put("UserOccupation", userOccupation);
            reviewData.put("ReviewRating", reviewRating);
            reviewData.put("ReviewDate", reviewDate);
            reviewData.put("ReviewText", reviewText);

            MongoDBDataStoreUtilities.insertReview(reviewData);

            response.getWriter().write("Review submitted successfully!");
        } catch (NumberFormatException e) {
            response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Invalid number format.");
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, "Server error occurred.");
            e.printStackTrace();
        }
    }
}
