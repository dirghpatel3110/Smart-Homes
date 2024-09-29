package servlets;

import model.Store;
import utilities.MySQLDataStoreUtilities;
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

@WebServlet("/stores")
public class StoreServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        try {
            List<Store> stores = dataStore.getAllStores();
            JSONArray storesArray = new JSONArray();
            for (Store store : stores) {
                JSONObject storeJSON = new JSONObject();
                storeJSON.put("storeId", store.getStoreId());
                storeJSON.put("street", store.getStreet());
                storeJSON.put("city", store.getCity());
                storeJSON.put("state", store.getState());
                storeJSON.put("zipCode", store.getZipCode());
                storesArray.put(storeJSON);
            }
            resp.setContentType("application/json");
            resp.getWriter().write(storesArray.toString());
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
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
        JSONObject storeJSON = new JSONObject(json);

        Store newStore = new Store();
        newStore.setStreet(storeJSON.getString("street"));
        newStore.setCity(storeJSON.getString("city"));
        newStore.setState(storeJSON.getString("state"));
        newStore.setZipCode(storeJSON.getString("zipCode"));

        try {
            dataStore.addStore(newStore);
            resp.setStatus(HttpServletResponse.SC_CREATED);
            resp.getWriter().write("Store added successfully.");
        } catch (SQLException e) {
            e.printStackTrace();
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        }
    }
}