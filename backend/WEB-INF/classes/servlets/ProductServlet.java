package servlets;

import utilities.MySQLDataStoreUtilities;
import model.Product;
import model.Accessory;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.BufferedReader;
import java.io.IOException;
import java.sql.SQLException;
import java.util.List;

@WebServlet("/products")
public class ProductServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

   @Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    String action = req.getParameter("action");

    try {
        if (action != null) {
            if (action.equals("accessories")) {
                int productId = Integer.parseInt(req.getParameter("productId"));
                List<Accessory> accessories = dataStore.getAccessoriesByProductId(productId);
                JSONArray accessoriesArray = new JSONArray();
                for (Accessory accessory : accessories) {
                    JSONObject accessoryJSON = new JSONObject();
                    accessoryJSON.put("id", accessory.getId());
                    accessoryJSON.put("product_id", accessory.getProductId());
                    accessoryJSON.put("name", accessory.getName());
                    accessoryJSON.put("description", accessory.getDescription());
                    accessoryJSON.put("price", accessory.getPrice());
                    accessoriesArray.put(accessoryJSON);
                }
                resp.setContentType("application/json");
                resp.getWriter().write(accessoriesArray.toString());

            } else if (action.equals("getLike")) {
                int productId = Integer.parseInt(req.getParameter("productId"));
                int likeCount = dataStore.getLikeCount(productId);
                JSONObject response = new JSONObject();
                response.put("likeCount", likeCount);
                resp.setContentType("application/json");
                resp.getWriter().write(response.toString());

            } else if (action.equals("mostLiked")) {
                List<Product> mostLikedProducts = dataStore.getMostLikedProducts(); 
                JSONArray productsArray = new JSONArray();
                for (Product product : mostLikedProducts) {
                    JSONObject productJSON = new JSONObject();
                    productJSON.put("id", product.getId());
                    productJSON.put("name", product.getName());
                    productJSON.put("description", product.getDescription());
                    productJSON.put("price", product.getPrice());
                    productJSON.put("likes", product.getLikes()); 
                    productJSON.put("retailer_special_discounts", product.getRetailerSpecialDiscounts());
                    productJSON.put("manufacturer_rebate", product.getManufacturerRebates());
                    productJSON.put("warranty_price", product.getWarrantyPrice());
                    productJSON.put("category", product.getCategory());
                    
                    productsArray.put(productJSON);
                }
                resp.setContentType("application/json");
                resp.getWriter().write(productsArray.toString());

    
            } else {
                fetchAllProducts(resp); 
            }
        } else {
            fetchAllProducts(resp);
        }
    } catch (SQLException e) {
        e.printStackTrace(); 
        resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        resp.getWriter().write("Error occurred: " + e.getMessage()); 
    } catch (NumberFormatException e) {
        e.printStackTrace();
        resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
        resp.getWriter().write("Invalid product ID: " + e.getMessage());
    }
}

private void fetchAllProducts(HttpServletResponse resp) throws IOException, SQLException {
    List<Product> products = dataStore.getAllProducts();
    JSONArray productsArray = new JSONArray();
    for (Product product : products) {
        JSONObject productJSON = new JSONObject();
        productJSON.put("id", product.getId());
        productJSON.put("name", product.getName());
        productJSON.put("description", product.getDescription());
        productJSON.put("price", product.getPrice());
        productJSON.put("retailer_special_discounts", product.getRetailerSpecialDiscounts());
        productJSON.put("manufacturer_rebate", product.getManufacturerRebates());
        productJSON.put("warranty_price", product.getWarrantyPrice());
        productJSON.put("category", product.getCategory());

        List<Accessory> accessories = dataStore.getAccessoriesByProductId(product.getId());
        JSONArray accessoriesArray = new JSONArray();
        for (Accessory accessory : accessories) {
            JSONObject accessoryJSON = new JSONObject();
            accessoryJSON.put("id", accessory.getId());
            accessoryJSON.put("name", accessory.getName());
            accessoryJSON.put("description", accessory.getDescription());
            accessoryJSON.put("price", accessory.getPrice());
            accessoriesArray.put(accessoryJSON);
        }
        productJSON.put("accessories", accessoriesArray);
        productsArray.put(productJSON);
    }
    resp.setContentType("application/json");
    resp.getWriter().write(productsArray.toString());
}


    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getParameter("action");

        if (action != null && action.equals("like")) {
            try {
                int productId = Integer.parseInt(req.getParameter("productId"));
                dataStore.incrementLike(productId);  
                int likeCount = dataStore.getLikeCount(productId);  
                JSONObject response = new JSONObject();
                response.put("likeCount", likeCount);
                resp.setContentType("application/json");
                resp.getWriter().write(response.toString());
            } catch (SQLException e) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("Error processing like: " + e.getMessage());
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("Invalid product ID format.");
            }
        } else if (action != null && action.equals("unlike")) {
            try {
                int productId = Integer.parseInt(req.getParameter("productId"));
                dataStore.decrementLike(productId);  
                int likeCount = dataStore.getLikeCount(productId);  
                JSONObject response = new JSONObject();
                response.put("likeCount", likeCount);
                resp.setContentType("application/json");
                resp.getWriter().write(response.toString());
            } catch (SQLException e) {
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("Error processing unlike: " + e.getMessage());
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("Invalid product ID format.");
            }
        } else if (action != null && action.equals("accessory")) {
            try {
                BufferedReader reader = req.getReader();
                StringBuilder jsonBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    jsonBuilder.append(line);
                }
                String json = jsonBuilder.toString();
                JSONObject newAccessoryJSON = new JSONObject(json);
                Accessory newAccessory = new Accessory();
                newAccessory.setProductId(newAccessoryJSON.getInt("product_id"));
                newAccessory.setName(newAccessoryJSON.getString("name"));
                newAccessory.setDescription(newAccessoryJSON.getString("description"));
                newAccessory.setPrice(newAccessoryJSON.getDouble("price"));
                dataStore.addAccessory(newAccessory);
                resp.setStatus(HttpServletResponse.SC_CREATED);
                resp.getWriter().write("Accessory added successfully.");
            } catch (SQLException e) {
                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            try {
                BufferedReader reader = req.getReader();
                StringBuilder jsonBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    jsonBuilder.append(line);
                }
                String json = jsonBuilder.toString();
                JSONObject newProductJSON = new JSONObject(json);
                Product newProduct = new Product();
                newProduct.setName(newProductJSON.getString("name"));
                newProduct.setDescription(newProductJSON.getString("description"));
                newProduct.setPrice(newProductJSON.getDouble("price"));
                newProduct.setRetailerSpecialDiscounts(newProductJSON.getDouble("retailer_special_discounts"));
                newProduct.setManufacturerRebates(newProductJSON.getDouble("manufacturer_rebate"));
                newProduct.setWarrantyPrice(newProductJSON.getDouble("warranty_price"));
                newProduct.setCategory(newProductJSON.getString("category"));
                dataStore.addProduct(newProduct);
                resp.setStatus(HttpServletResponse.SC_CREATED);
                resp.getWriter().write("Product added successfully.");
            } catch (SQLException e) {
                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getParameter("action");
        if (action != null && action.equals("accessory")) {
            try {
                BufferedReader reader = req.getReader();
                StringBuilder jsonBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    jsonBuilder.append(line);
                }
                String json = jsonBuilder.toString();
                JSONObject updatedAccessoryJSON = new JSONObject(json);
                Accessory updatedAccessory = new Accessory();
                updatedAccessory.setId(updatedAccessoryJSON.getInt("id"));
                updatedAccessory.setProductId(updatedAccessoryJSON.getInt("product_id"));
                updatedAccessory.setName(updatedAccessoryJSON.getString("name"));
                updatedAccessory.setDescription(updatedAccessoryJSON.getString("description"));
                updatedAccessory.setPrice(updatedAccessoryJSON.getDouble("price"));
                dataStore.updateAccessory(updatedAccessory);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("Accessory updated successfully.");
            } catch (SQLException e) {
                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        } else {
            try {
                BufferedReader reader = req.getReader();
                StringBuilder jsonBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    jsonBuilder.append(line);
                }
                String json = jsonBuilder.toString();
                JSONObject updatedProductJSON = new JSONObject(json);
                Product updatedProduct = new Product();
                updatedProduct.setId(updatedProductJSON.getInt("id"));
                updatedProduct.setName(updatedProductJSON.getString("name"));
                updatedProduct.setDescription(updatedProductJSON.getString("description"));
                updatedProduct.setPrice(updatedProductJSON.getDouble("price"));
                updatedProduct.setRetailerSpecialDiscounts(updatedProductJSON.getDouble("retailer_special_discounts"));
                updatedProduct.setManufacturerRebates(updatedProductJSON.getDouble("manufacturer_rebate"));
                updatedProduct.setWarrantyPrice(updatedProductJSON.getDouble("warranty_price"));
                updatedProduct.setCategory(updatedProductJSON.getString("category"));
                dataStore.updateProduct(updatedProduct);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("Product updated successfully.");
            } catch (SQLException e) {
                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            }
        }
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String action = req.getParameter("action");
        if (action != null && action.equals("accessory")) {
            try {
                int accessoryId = Integer.parseInt(req.getParameter("id"));
                dataStore.deleteAccessory(accessoryId);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("Accessory deleted successfully.");
            } catch (SQLException e) {
                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("Error deleting accessory: " + e.getMessage());
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("Invalid accessory ID format.");
            }
        } else {
            try {
                int productId = Integer.parseInt(req.getParameter("id"));
                dataStore.deleteProduct(productId);
                resp.setStatus(HttpServletResponse.SC_OK);
                resp.getWriter().write("Product and its accessories deleted successfully.");
            } catch (SQLException e) {
                e.printStackTrace();
                resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                resp.getWriter().write("Error deleting product: " + e.getMessage());
            } catch (NumberFormatException e) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("Invalid product ID format.");
            }
        }
    }
}
