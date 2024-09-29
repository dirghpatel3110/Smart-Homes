package utilities;

import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.MongoCollection;
import org.bson.Document;

import java.util.HashMap;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

public class MongoDBDataStoreUtilities {

    private static MongoCollection<Document> reviews;

    static {
    try {
        MongoClient mongoClient = MongoClients.create("mongodb://localhost:27017");
        MongoDatabase database = mongoClient.getDatabase("ewa-mongo");
        reviews = database.getCollection("ProductReviews");
    } catch (Exception e) {
        System.out.println("MongoDB connection error: " + e.getMessage());
        reviews = null; 
    }
}

public static void insertReview(HashMap<String, Object> reviewData) {
    if (reviews == null) {
        System.out.println("Error: MongoDB connection was not initialized.");
        return;
    }
    
    try {
        Document doc = new Document();
        doc.putAll(reviewData);
        reviews.insertOne(doc);
    } catch (Exception e) {
        System.out.println("Error inserting review: " + e.getMessage());
    }
}

public static List<Map<String, Object>> getTopRatedProducts(int limit) {
        if (reviews == null) {
            System.out.println("Error: MongoDB connection was not initialized.");
            return new ArrayList<>(); 
        }

        List<Document> pipeline = List.of(
            new Document("$group", new Document("_id", "$ProductModelName")
                .append("averageRating", new Document("$avg", "$ReviewRating"))
            ),
            new Document("$sort", new Document("averageRating", -1)),
            new Document("$limit", limit)
        );

        List<Document> topRated = reviews.aggregate(pipeline).into(new ArrayList<>());

        List<Map<String, Object>> result = new ArrayList<>();
        for (Document doc : topRated) {
            Map<String, Object> productData = new HashMap<>();
            productData.put("ProductModelName", doc.getString("_id"));
            productData.put("AverageRating", doc.getDouble("averageRating"));
            result.add(productData);
        }
        
        return result;
    }

}
