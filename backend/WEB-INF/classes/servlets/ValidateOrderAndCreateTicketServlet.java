import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import model.Transaction; 
import utilities.MySQLDataStoreUtilities;
import javax.servlet.annotation.MultipartConfig;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.Part;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Base64;

@WebServlet("/validate_ticket_and_create")
@MultipartConfig
public class ValidateOrderAndCreateTicketServlet extends HttpServlet {
    private final MySQLDataStoreUtilities dataStore = new MySQLDataStoreUtilities();
    private static final String API_KEY = "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"; // Replace with your actual OpenAI API key

    // Instruction prompt to guide the model's decision-making
    private static final String instructionPrompt = "You are a customer service assistant for a delivery service, equipped to analyze images of packages. " +
            "If a package appears damaged in the image, automatically process a refund according to policy. " +
            "If the package looks wet, initiate a replacement. " +
            "If the package appears normal and not damaged, escalate to agent. " +
            "For any other issues or unclear images, escalate to agent. You must always use tools!";

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String orderId = req.getParameter("orderId");
        String description = req.getParameter("description");
        Part imagePart = req.getPart("image");

        try {
            Transaction transaction = dataStore.getTransactionByOrderId(orderId);
            if (transaction == null) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("Please provide a valid order ID.");
                return;
            }

            if (!"delivered".equalsIgnoreCase(transaction.getOrderStatus())) {
                resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
                resp.getWriter().write("Order not delivered yet.");
                return;
            }

            String imageBase64 = Base64.getEncoder().encodeToString(imagePart.getInputStream().readAllBytes());
            String decision = callOpenAiApi(imageBase64);

            int ticketNumber = createTicket(orderId, description, decision);

            resp.setStatus(HttpServletResponse.SC_CREATED);
            JSONObject responseJson = new JSONObject();
            responseJson.put("message", "Ticket created successfully with ID: " + ticketNumber);
            responseJson.put("decision", decision);
            resp.setContentType("application/json");
            resp.getWriter().write(responseJson.toString());

        } catch (SQLException e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("Error processing request: " + e.getMessage());
        }
    }

    private String callOpenAiApi(String imageBase64) throws IOException {
        URL url = new URL("https://api.openai.com/v1/chat/completions");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setRequestProperty("Authorization", "Bearer " + API_KEY);
        connection.setDoOutput(true);

        JSONObject payload = new JSONObject();
        payload.put("model", "gpt-4o-mini"); // Specify model
        payload.put("messages", new JSONArray()
                .put(new JSONObject().put("role", "system").put("content", instructionPrompt)) // Instruction for the model
                .put(new JSONObject().put("role", "user").put("content", "Analyze the following image and make a decision.")) 
                .put(new JSONObject().put("role", "user").put("content", new JSONArray()
                        .put(new JSONObject().put("type", "image_url").put("image_url",
                                new JSONObject().put("url", "data:image/jpeg;base64," + imageBase64))))));

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = payload.toString().getBytes();
            os.write(input, 0, input.length);
        }

        try (BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream()))) {
            StringBuilder responseBuilder = new StringBuilder();
            String responseLine;
            while ((responseLine = br.readLine()) != null) {
                responseBuilder.append(responseLine.trim());
            }
            JSONObject responseJson = new JSONObject(responseBuilder.toString());
            
            // Extract and return only the decision content
            return responseJson.getJSONArray("choices").getJSONObject(0).getJSONObject("message").getString("content");
        }
    }

    private int createTicket(String orderId, String description, String decision) throws SQLException {
        String insertQuery = "INSERT INTO tickets (order_id, description, decision) VALUES (?, ?, ?)";
        try (Connection connection = dataStore.getConnection();
             PreparedStatement ps = connection.prepareStatement(insertQuery, PreparedStatement.RETURN_GENERATED_KEYS)) {
            ps.setString(1, orderId);
            ps.setString(2, description);
            ps.setString(3, decision);
            ps.executeUpdate();

            try (ResultSet rs = ps.getGeneratedKeys()) {
                if (rs.next()) {
                    return rs.getInt(1); // Get the generated ticket number
                } else {
                    throw new SQLException("Failed to retrieve generated ticket number.");
                }
            }
        }
    }
}
