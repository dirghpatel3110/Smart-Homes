package servlets;
import model.ZipCodePair;
import model.Pair; 
import model.TopResults; 
import utilities.MySQLDataStoreUtilities;
import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.sql.SQLException;
import java.util.*;


@WebServlet("/trending")
 public class TrendingServlet extends HttpServlet {

   private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();

@Override
protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
    try {
        Map<String, Integer> zipCodes = dataStore.getTopFiveZipCodes();
        List<ZipCodePair> zipCodeList = new ArrayList<>();

        for (Map.Entry<String, Integer> entry : zipCodes.entrySet()) {
            zipCodeList.add(new ZipCodePair(entry.getKey(), entry.getValue()));
        }
        zipCodeList.sort((z1, z2) -> Integer.compare(z2.count, z1.count));

        List<String> topZipCodes = new ArrayList<>();
        List<Integer> topZipCodeCounts = new ArrayList<>();
        for (ZipCodePair zipCodePair : zipCodeList) {
            topZipCodes.add(zipCodePair.zipCode);
            topZipCodeCounts.add(zipCodePair.count);
        }

        Map<Integer, Integer> products = dataStore.getTopFiveMostSoldProducts();
        List<Pair> productList = new ArrayList<>();
        for (Map.Entry<Integer, Integer> entry : products.entrySet()) {
            productList.add(new Pair(entry.getKey(), entry.getValue()));
        }
        productList.sort((p1, p2) -> Integer.compare(p2.count, p1.count));

        List<Integer> topProducts = new ArrayList<>();
        List<Integer> topProductCounts = new ArrayList<>();
        for (Pair pair : productList) {
            topProducts.add(pair.productId);
            topProductCounts.add(pair.count);
        }

        TopResults topResults = new TopResults(topZipCodes, topZipCodeCounts, topProducts, topProductCounts);

        JSONObject responseJson = new JSONObject();
        responseJson.put("topZipCodes", new JSONArray(topResults.getTopZipCodes()));
        responseJson.put("topZipCodeCounts", new JSONArray(topResults.getTopZipCodeCounts()));
        responseJson.put("topProducts", new JSONArray(topResults.getTopProducts()));
        responseJson.put("topProductCounts", new JSONArray(topResults.getTopProductCounts()));

        resp.setContentType("application/json");
        resp.getWriter().write(responseJson.toString());

    } catch (SQLException e) {
        resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
        resp.getWriter().write("Error fetching trending data: " + e.getMessage());
    }
}
 }