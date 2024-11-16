// import javax.servlet.ServletException;
// import javax.servlet.annotation.WebServlet;
// import javax.servlet.http.HttpServlet;
// import javax.servlet.http.HttpServletRequest;
// import javax.servlet.http.HttpServletResponse;
// import java.io.IOException;
// import java.io.OutputStream;
// import java.net.HttpURLConnection;
// import java.net.URL;
// import java.util.Scanner;

// @WebServlet("/semanticSearch")
// public class SemanticSearchServlet extends HttpServlet {

//     private static final String ELASTICSEARCH_URL = "http://localhost:9200/products_index/_search";
//     private static final String OPENAI_API_KEY = "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";
//     private static final String EMBEDDING_MODEL = "text-embedding-3-small";

//     @Override
//     protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
//         String question = req.getParameter("question");
//         if (question == null || question.isEmpty()) {
//             resp.getWriter().write("Please provide a 'question' parameter.");
//             return;
//         }

//         // Get embedding for the question
//         String embedding = getEmbedding(question);

//         // Perform KNN search in Elasticsearch
//         String searchResults = performKnnSearch(embedding);

//         // Return the results
//         resp.setContentType("application/json");
//         resp.getWriter().write(searchResults);
//     }

//     private String getEmbedding(String text) throws IOException {
//         URL url = new URL("https://api.openai.com/v1/embeddings");
//         HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//         connection.setRequestMethod("POST");
//         connection.setRequestProperty("Authorization", "Bearer " + OPENAI_API_KEY);
//         connection.setRequestProperty("Content-Type", "application/json");
//         connection.setDoOutput(true);

//         // Create JSON request body
//         String jsonInputString = "{\"model\": \"" + EMBEDDING_MODEL + "\", \"input\": [\"" + text.replace("\n", " ") + "\"]}";

//         try (OutputStream os = connection.getOutputStream()) {
//             byte[] input = jsonInputString.getBytes("utf-8");
//             os.write(input, 0, input.length);
//         }

//         // Read response
//         try (Scanner scanner = new Scanner(connection.getInputStream())) {
//             return scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
//         }
//     }

//     private String performKnnSearch(String embedding) throws IOException {
//     URL url = new URL(ELASTICSEARCH_URL);
//     HttpURLConnection connection = (HttpURLConnection) url.openConnection();
//     connection.setRequestMethod("POST");
//     connection.setRequestProperty("Content-Type", "application/json");
//     connection.setDoOutput(true);

//     // Parse the embedding string into a JSON array format
//     String jsonInputString = "{"
//         + "\"knn\": {"
//         + "\"field\": \"product_vector\","
//         + "\"query_vector\": " + embedding + ","  // Ensure this is a valid JSON array
//         + "\"k\": 7,"
//         + "\"num_candidates\": 100"
//         + "},"
//         + "\"_source\": [\"id\", \"name\", \"description\", \"price\", \"retailer_special_discounts\", \"manufacturer_rebates\", \"warranty_price\", \"category\"]"
//         + "}";

//     try (OutputStream os = connection.getOutputStream()) {
//         byte[] input = jsonInputString.getBytes("utf-8");
//         os.write(input, 0, input.length);
//     }

//     // Read response from Elasticsearch
//     try (Scanner scanner = new Scanner(connection.getInputStream())) {
//         return scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
//     }
// }

// }





import org.json.JSONArray;
import org.json.JSONObject;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

@WebServlet("/semanticSearch")
public class SemanticSearchServlet extends HttpServlet {

    private static final String ELASTICSEARCH_URL = "http://localhost:9200/products_index/_search";
    private static final String OPENAI_API_KEY = "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";
    private static final String EMBEDDING_MODEL = "text-embedding-3-small";

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String question = req.getParameter("question");
        if (question == null || question.isEmpty()) {
            resp.getWriter().write("Please provide a 'question' parameter.");
            return;
        }

        // Get embedding for the question
        String embedding = getEmbedding(question);

        // Perform KNN search in Elasticsearch
        String searchResults = performKnnSearch(embedding);

        // Return the results
        resp.setContentType("application/json");
        resp.getWriter().write(searchResults);
    }

    private String getEmbedding(String text) throws IOException {
        URL url = new URL("https://api.openai.com/v1/embeddings");
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Authorization", "Bearer " + OPENAI_API_KEY);
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);

        // Create JSON request body
        String jsonInputString = "{\"model\": \"" + EMBEDDING_MODEL + "\", \"input\": [\"" + text.replace("\n", " ") + "\"]}";

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        // Read response
        try (Scanner scanner = new Scanner(connection.getInputStream())) {
            return scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
        }
    }

    private String performKnnSearch(String embedding) throws IOException {
        String parsedEmbedding = parseEmbeddingToArray(embedding);

        URL url = new URL(ELASTICSEARCH_URL);
        HttpURLConnection connection = (HttpURLConnection) url.openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/json");
        connection.setDoOutput(true);

        String jsonInputString = "{"
                + "\"knn\": {"
                + "\"field\": \"product_vector\","
                + "\"query_vector\": " + parsedEmbedding + ","
                + "\"k\": 5,"
                + "\"num_candidates\": 100"
                + "},"
                + "\"_source\": [\"id\", \"name\", \"description\", \"price\", \"retailer_special_discounts\", \"manufacturer_rebates\", \"warranty_price\", \"category\"]"
                + "}";

        try (OutputStream os = connection.getOutputStream()) {
            byte[] input = jsonInputString.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        int responseCode = connection.getResponseCode();
        if (responseCode == HttpURLConnection.HTTP_OK) {
            try (Scanner scanner = new Scanner(connection.getInputStream())) {
                return scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
            }
        } else {
            try (InputStream errorStream = connection.getErrorStream();
                 Scanner scanner = new Scanner(errorStream)) {
                String errorResponse = scanner.useDelimiter("\\A").hasNext() ? scanner.next() : "";
                throw new IOException("Elasticsearch Error: " + errorResponse);
            }
        }
    }

    private String parseEmbeddingToArray(String embeddingJson) {
        JSONObject jsonObject = new JSONObject(embeddingJson);
        JSONArray dataArray = jsonObject.getJSONArray("data");
        return dataArray.getJSONObject(0).getJSONArray("embedding").toString();
    }
}
