package utilities;

import model.Product;
import model.Accessory;
import model.User;
import model.Cart;
import model.Store;
import model.TopResults;
import model.Transaction;
import model.ProductInventory;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;



import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

public class MySQLDataStoreUtilities {
    private final String jdbcURL = "jdbc:mysql://localhost:3306/SmartHomes";
    private final String jdbcUsername = "root";
    private final String jdbcPassword = "Dp@95108";

    // Product SQL statements
    private static final String INSERT_PRODUCT_SQL = "INSERT INTO products (name, description, price, retailer_special_discounts, manufacturer_rebates, warranty_price, category, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String SELECT_ALL_PRODUCTS = "SELECT * FROM products";
    private static final String SELECT_PRODUCT_BY_ID = "SELECT * FROM products WHERE id = ?";
    private static final String UPDATE_PRODUCT_SQL = "UPDATE products SET name = ?, description = ?, price = ?, retailer_special_discounts = ?, manufacturer_rebates = ?, warranty_price = ?, category = ? WHERE id = ?";
    private static final String DELETE_PRODUCT_SQL = "DELETE FROM products WHERE id = ?";

    // Accessory SQL statements
    private static final String INSERT_ACCESSORY_SQL = "INSERT INTO accessories (product_id, name, description, price) VALUES (?, ?, ?, ?)";
    private static final String SELECT_ACCESSORIES_BY_PRODUCT_ID = "SELECT * FROM accessories WHERE product_id = ?";
    private static final String SELECT_ACCESSORY_BY_ID = "SELECT * FROM accessories WHERE id = ?";
    private static final String UPDATE_ACCESSORY_SQL = "UPDATE accessories SET product_id = ?, name = ?, description = ?, price = ? WHERE id = ?";
    private static final String DELETE_ACCESSORY_SQL = "DELETE FROM accessories WHERE id = ?";

    //Login SQL statements
    private static final String AUTHENTICATE_USER_SQL = "SELECT * FROM Users WHERE email = ? AND password = ?";
    
    //SignUp SQL statements
    private static final String INSERT_USER_SQL = "INSERT INTO Users (name, email, password, role, userAge, userGender, street, city, state, zip_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String SELECT_USER_BY_EMAIL = "SELECT * FROM Users WHERE email = ?";

    // Cart SQL statements
    private static final String INSERT_CART_ITEM_SQL = "INSERT INTO cart (user_id, product_id, product_name, quantity, price, category,warranty, discount) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    private static final String SELECT_CART_ITEMS_SQL = "SELECT * FROM cart WHERE user_id = ?";
    private static final String UPDATE_CART_ITEM_SQL = "UPDATE cart SET quantity = ? WHERE id = ?";
    private static final String DELETE_CART_ITEM_SQL = "DELETE FROM cart WHERE id = ?";
    private static final String INSERT_CART_ACCESSORY_SQL = "INSERT INTO cart_accessories (cart_id, accessory_id, quantity, price, description) VALUES (?, ?, ?, ?, ?)";
    private static final String SELECT_CART_ACCESSORIES_SQL = "SELECT a.*, ca.quantity, ca.price, ca.description FROM accessories a JOIN cart_accessories ca ON a.id = ca.accessory_id WHERE ca.cart_id = ?";

    // Store Cart SQL statements
    private static final String INSERT_STORE_SQL = "INSERT INTO stores (street, city, state, zip_code) VALUES (?, ?, ?, ?)";
    private static final String SELECT_ALL_STORES = "SELECT * FROM stores";
    private static final String SELECT_STORE_BY_ID = "SELECT * FROM stores WHERE StoreID = ?";

    // clearcart SQL statements
    private static final String DELETE_CART_BY_USER_ID = "DELETE FROM cart WHERE user_id = ?";

    //transactions SQL statements
    private static final String INSERT_TRANSACTION_SQL = "INSERT INTO transactions (user_id, customer_name, street, city, state, zip_code, credit_card_number, order_id, purchase_date, delivery_date, product_id, category, quantity, price, shipping_cost, discount, total_sales, store_id, store_street, store_city, store_state, store_zip, delivery_option, order_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    
    // like SQL
    private static final String INCREMENT_LIKE_SQL = "UPDATE products SET likes = likes + 1 WHERE id = ?";
    private static final String DECREMENT_LIKE_SQL = "UPDATE products SET likes = likes - 1 WHERE id = ? AND likes > 0"; // Prevents negative likes
    private static final String GET_LIKE_COUNT_SQL = "SELECT likes FROM products WHERE id = ?";
    private static final String GET_MOST_LIKED_PRODUCTS_SQL = "SELECT * FROM Products ORDER BY likes DESC LIMIT 5";

    protected Connection getConnection() throws SQLException {
        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            throw new SQLException("MySQL JDBC Driver not found", e);
        }
        return DriverManager.getConnection(jdbcURL, jdbcUsername, jdbcPassword);
    }

    public List<Product> getAllProducts() throws SQLException {
        List<Product> products = new ArrayList<>();
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_ALL_PRODUCTS);
             ResultSet rs = preparedStatement.executeQuery()) {

            while (rs.next()) {
                Product product = new Product();
                product.setId(rs.getInt("id"));
                product.setName(rs.getString("name"));
                product.setDescription(rs.getString("description"));
                product.setPrice(rs.getDouble("price"));
                product.setRetailerSpecialDiscounts(rs.getDouble("retailer_special_discounts"));
                product.setManufacturerRebates(rs.getDouble("manufacturer_rebates"));
                product.setWarrantyPrice(rs.getDouble("warranty_price"));
                product.setCategory(rs.getString("category"));
                product.setLikes(rs.getInt("likes"));
                products.add(product);
            }
        }
        return products;
    }

    public void addProduct(Product product) throws SQLException {
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_PRODUCT_SQL)) {
            preparedStatement.setString(1, product.getName());
            preparedStatement.setString(2, product.getDescription());
            preparedStatement.setDouble(3, product.getPrice());
            preparedStatement.setDouble(4, product.getRetailerSpecialDiscounts());
            preparedStatement.setDouble(5, product.getManufacturerRebates());
            preparedStatement.setDouble(6, product.getWarrantyPrice());
            preparedStatement.setString(7, product.getCategory());
            preparedStatement.executeUpdate();
        }
    }

    public void updateProduct(Product product) throws SQLException {
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(UPDATE_PRODUCT_SQL)) {
            preparedStatement.setString(1, product.getName());
            preparedStatement.setString(2, product.getDescription());
            preparedStatement.setDouble(3, product.getPrice());
            preparedStatement.setDouble(4, product.getRetailerSpecialDiscounts());
            preparedStatement.setDouble(5, product.getManufacturerRebates());
            preparedStatement.setDouble(6, product.getWarrantyPrice());
            preparedStatement.setString(7, product.getCategory());
            preparedStatement.setInt(8, product.getId());
            preparedStatement.executeUpdate();
        }
    }

    public void deleteProduct(int id) throws SQLException {
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(DELETE_PRODUCT_SQL)) {
            preparedStatement.setInt(1, id);
            preparedStatement.executeUpdate();
        }
    }

    public Product getProductById(int id) throws SQLException {
        Product product = null;
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_PRODUCT_BY_ID)) {
            preparedStatement.setInt(1, id);
            try (ResultSet rs = preparedStatement.executeQuery()) {
                if (rs.next()) {
                    product = new Product();
                    product.setId(rs.getInt("id"));
                    product.setName(rs.getString("name"));
                    product.setDescription(rs.getString("description"));
                    product.setPrice(rs.getDouble("price"));
                    product.setRetailerSpecialDiscounts(rs.getDouble("retailer_special_discounts"));
                    product.setManufacturerRebates(rs.getDouble("manufacturer_rebates"));
                    product.setWarrantyPrice(rs.getDouble("warranty_price"));
                    product.setCategory(rs.getString("category"));
                }
            }
        }
        return product;
    }

    public List<Accessory> getAccessoriesByProductId(int productId) throws SQLException {
        List<Accessory> accessories = new ArrayList<>();
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_ACCESSORIES_BY_PRODUCT_ID)) {
            preparedStatement.setInt(1, productId);
            try (ResultSet rs = preparedStatement.executeQuery()) {
                while (rs.next()) {
                    Accessory accessory = new Accessory();
                    accessory.setId(rs.getInt("id"));
                    accessory.setProductId(rs.getInt("product_id"));
                    accessory.setName(rs.getString("name"));
                    accessory.setDescription(rs.getString("description"));
                    accessory.setPrice(rs.getDouble("price"));
                    accessories.add(accessory);
                }
            }
        }
        return accessories;
    }

    public void addAccessory(Accessory accessory) throws SQLException {
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_ACCESSORY_SQL)) {
            preparedStatement.setInt(1, accessory.getProductId());
            preparedStatement.setString(2, accessory.getName());
            preparedStatement.setString(3, accessory.getDescription());
            preparedStatement.setDouble(4, accessory.getPrice());
            preparedStatement.executeUpdate();
        }
    }

    public void updateAccessory(Accessory accessory) throws SQLException {
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(UPDATE_ACCESSORY_SQL)) {
            preparedStatement.setInt(1, accessory.getProductId());
            preparedStatement.setString(2, accessory.getName());
            preparedStatement.setString(3, accessory.getDescription());
            preparedStatement.setDouble(4, accessory.getPrice());
            preparedStatement.setInt(5, accessory.getId());
            preparedStatement.executeUpdate();
        }
    }

    public void deleteAccessory(int id) throws SQLException {
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(DELETE_ACCESSORY_SQL)) {
            preparedStatement.setInt(1, id);
            preparedStatement.executeUpdate();
        }
    }

    public Accessory getAccessoryById(int id) throws SQLException {
        Accessory accessory = null;
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_ACCESSORY_BY_ID)) {
            preparedStatement.setInt(1, id);
            try (ResultSet rs = preparedStatement.executeQuery()) {
                if (rs.next()) {
                    accessory = new Accessory();
                    accessory.setId(rs.getInt("id"));
                    accessory.setProductId(rs.getInt("product_id"));
                    accessory.setName(rs.getString("name"));
                    accessory.setDescription(rs.getString("description"));
                    accessory.setPrice(rs.getDouble("price"));
                }
            }
        }
        return accessory;
    }
    

    public User authenticateUser(String email, String password) throws SQLException {
        User user = null;
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(AUTHENTICATE_USER_SQL)) {
            preparedStatement.setString(1, email);
            preparedStatement.setString(2, password);
            try (ResultSet rs = preparedStatement.executeQuery()) {
                if (rs.next()) {
                    user = new User();
                    user.setId(rs.getInt("id"));
                    user.setName(rs.getString("name"));
                    user.setEmail(rs.getString("email"));
                    user.setRole(rs.getString("role"));
                    user.setPassword(rs.getString("password"));
                    user.setUserAge(rs.getInt("userAge"));
                    user.setUserGender(rs.getString("userGender"));
                }
            }
        }
        return user;
    }
    public void addUser(User user) throws SQLException {
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_USER_SQL)) {
            preparedStatement.setString(1, user.getName());
            preparedStatement.setString(2, user.getEmail());
            preparedStatement.setString(3, user.getPassword());
            preparedStatement.setString(4, user.getRole());
            preparedStatement.setInt(5, user.getUserAge());
            preparedStatement.setString(6, user.getUserGender());
            preparedStatement.setString(7, user.getStreet());
            preparedStatement.setString(8, user.getCity());
            preparedStatement.setString(9, user.getState());
            preparedStatement.setString(10, user.getZipCode());
            preparedStatement.executeUpdate();
        }
    }

    public User getUserByEmail(String email) throws SQLException {
        User user = null;
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_USER_BY_EMAIL)) {
            preparedStatement.setString(1, email);
            try (ResultSet rs = preparedStatement.executeQuery()) {
                if (rs.next()) {
                    user = new User();
                    user.setId(rs.getInt("id"));
                    user.setName(rs.getString("name"));
                    user.setEmail(rs.getString("email"));
                    user.setRole(rs.getString("role"));
                    user.setStreet(rs.getString("userAge"));
                    user.setStreet(rs.getString("userGender"));
                    user.setStreet(rs.getString("street"));
                    user.setCity(rs.getString("city"));
                    user.setState(rs.getString("state"));
                    user.setZipCode(rs.getString("zip_code"));
                }
            }
        }
        return user;
    }

    public void addToCart(Cart cartItem) throws SQLException {
        Connection connection = null;
        try {
            connection = getConnection();
            connection.setAutoCommit(false);      

            try (PreparedStatement preparedStatement = connection.prepareStatement(INSERT_CART_ITEM_SQL, Statement.RETURN_GENERATED_KEYS)) {
                preparedStatement.setInt(1, cartItem.getUserId());
                preparedStatement.setInt(2, cartItem.getProductId());
                preparedStatement.setString(3, cartItem.getProductName());
                preparedStatement.setInt(4, cartItem.getQuantity());
                preparedStatement.setDouble(5, cartItem.getPrice());
                preparedStatement.setString(6, cartItem.getCategory());
                preparedStatement.setDouble(7, cartItem.getWarranty());
                preparedStatement.setDouble(8, cartItem.getDiscount());
                preparedStatement.executeUpdate();

                try (ResultSet generatedKeys = preparedStatement.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        int cartId = generatedKeys.getInt(1);
                        if (cartItem.getAccessories() != null) {
                            for (Accessory accessory : cartItem.getAccessories()) {
                                addCartAccessory(connection, cartId, accessory);
                            }
                        }
                    } else {
                        throw new SQLException("Creating cart item failed, no ID obtained.");
                    }
                }
            }

            connection.commit();
        } catch (SQLException e) {
            if (connection != null) {
                try {
                    connection.rollback();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                }
            }
            throw e;
        } finally {
            if (connection != null) {
                try {
                    connection.setAutoCommit(true);
                    connection.close();
                } catch (SQLException e) {
                    e.printStackTrace();
                }
            }
        }
    }

    private void addCartAccessory(Connection connection, int cartId, Accessory accessory) throws SQLException {
        try (PreparedStatement preparedStatement = connection.prepareStatement(INSERT_CART_ACCESSORY_SQL)) {
            preparedStatement.setInt(1, cartId);
            preparedStatement.setInt(2, accessory.getId());
            preparedStatement.setInt(3, accessory.getQuantity());
            preparedStatement.setDouble(4, accessory.getPrice());
            preparedStatement.setString(5, accessory.getDescription());
            preparedStatement.executeUpdate();
        }
    }

    public List<Cart> getCartItems(int userId) throws SQLException {
        List<Cart> cartItems = new ArrayList<>();
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_CART_ITEMS_SQL)) {
            preparedStatement.setInt(1, userId);
            try (ResultSet rs = preparedStatement.executeQuery()) {
                while (rs.next()) {
                    Cart cartItem = new Cart();
                    cartItem.setId(rs.getInt("id"));
                    cartItem.setUserId(rs.getInt("user_id"));
                    cartItem.setProductId(rs.getInt("product_id"));
                    cartItem.setProductName(rs.getString("product_name"));
                    cartItem.setQuantity(rs.getInt("quantity"));
                    cartItem.setPrice(rs.getDouble("price"));
                    cartItem.setCategory(rs.getString("category"));
                    cartItem.setWarranty(rs.getDouble("warranty"));
                    cartItem.setDiscount(rs.getDouble("discount"));
                    cartItem.setAccessories(getCartAccessories(cartItem.getId()));
                    cartItems.add(cartItem);
                }
            }
        }
        return cartItems;
    }

    private List<Accessory> getCartAccessories(int cartId) throws SQLException {
        List<Accessory> accessories = new ArrayList<>();
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(SELECT_CART_ACCESSORIES_SQL)) {
            preparedStatement.setInt(1, cartId);
            try (ResultSet rs = preparedStatement.executeQuery()) {
                while (rs.next()) {
                    Accessory accessory = new Accessory();
                    accessory.setId(rs.getInt("id"));
                    accessory.setProductId(rs.getInt("product_id"));
                    accessory.setName(rs.getString("name"));
                    accessory.setDescription(rs.getString("description"));
                    accessory.setPrice(rs.getDouble("price"));
                    accessory.setQuantity(rs.getInt("quantity"));
                    accessories.add(accessory);
                }
            }
        }
        return accessories;
    }

public void updateCartItem(int cartItemId, int newQuantity) throws SQLException {
    try (Connection connection = getConnection();
         PreparedStatement preparedStatement = connection.prepareStatement(UPDATE_CART_ITEM_SQL)) {
        preparedStatement.setInt(1, newQuantity);
        preparedStatement.setInt(2, cartItemId);
        preparedStatement.executeUpdate();
    }
}

public void removeFromCart(int cartItemId) throws SQLException {
    try (Connection connection = getConnection();
         PreparedStatement preparedStatement = connection.prepareStatement(DELETE_CART_ITEM_SQL)) {
        preparedStatement.setInt(1, cartItemId);
        preparedStatement.executeUpdate();
    }
}

public void addStore(Store store) throws SQLException {
    try (Connection connection = getConnection();
         PreparedStatement preparedStatement = connection.prepareStatement(INSERT_STORE_SQL)) {
        preparedStatement.setString(1, store.getStreet());
        preparedStatement.setString(2, store.getCity());
        preparedStatement.setString(3, store.getState());
        preparedStatement.setString(4, store.getZipCode());
        preparedStatement.executeUpdate();
    }
}

public List<Store> getAllStores() throws SQLException {
    List<Store> stores = new ArrayList<>();
    try (Connection connection = getConnection();
         PreparedStatement preparedStatement = connection.prepareStatement(SELECT_ALL_STORES);
         ResultSet rs = preparedStatement.executeQuery()) {
        while (rs.next()) {
            Store store = new Store();
            store.setStoreId(rs.getInt("StoreID"));
            store.setStreet(rs.getString("street"));
            store.setCity(rs.getString("city"));
            store.setState(rs.getString("state"));
            store.setZipCode(rs.getString("zip_code"));
            stores.add(store);
        }
    }
    return stores;
}

public Store getStoreById(int storeId) throws SQLException {
    Store store = null;
    try (Connection connection = getConnection();
         PreparedStatement preparedStatement = connection.prepareStatement(SELECT_STORE_BY_ID)) {
        preparedStatement.setInt(1, storeId);
        try (ResultSet rs = preparedStatement.executeQuery()) {
            if (rs.next()) {
                store = new Store();
                store.setStoreId(rs.getInt("StoreID"));
                store.setStreet(rs.getString("street"));
                store.setCity(rs.getString("city"));
                store.setState(rs.getString("state"));
                store.setZipCode(rs.getString("zip_code"));
            }
        }
    }
    return store;
}
    public void clearCart(int userId) throws SQLException {
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(DELETE_CART_BY_USER_ID)) {
            preparedStatement.setInt(1, userId);
            preparedStatement.executeUpdate();
        }
    }
    public void addTransaction(Transaction transaction) throws SQLException {
        try (Connection connection = getConnection();
             PreparedStatement preparedStatement = connection.prepareStatement(INSERT_TRANSACTION_SQL)) {
            preparedStatement.setInt(1, transaction.getUserId());
            preparedStatement.setString(2, transaction.getCustomerName());
            preparedStatement.setString(3, transaction.getStreet());
            preparedStatement.setString(4, transaction.getCity());
            preparedStatement.setString(5, transaction.getState());
            preparedStatement.setString(6, transaction.getZipCode());
            preparedStatement.setString(7, transaction.getCreditCardNumber());
            preparedStatement.setString(8, transaction.getOrderId());
            preparedStatement.setTimestamp(9, new Timestamp(transaction.getPurchaseDate().getTime()));
            preparedStatement.setTimestamp(10, new Timestamp(transaction.getDeliveryDate().getTime()));
            preparedStatement.setInt(11, transaction.getProductId());
            preparedStatement.setString(12, transaction.getCategory());
            preparedStatement.setInt(13, transaction.getQuantity());
            preparedStatement.setDouble(14, transaction.getPrice());
            preparedStatement.setDouble(15, transaction.getShippingCost());
            preparedStatement.setDouble(16, transaction.getDiscount());
            preparedStatement.setDouble(17, transaction.getTotalSales());
            if (transaction.getStoreId() != null) {
                preparedStatement.setInt(18, transaction.getStoreId());
                preparedStatement.setString(19, transaction.getStoreStreet());
                preparedStatement.setString(20, transaction.getStoreCity());
                preparedStatement.setString(21, transaction.getStoreState());
                preparedStatement.setString(22, transaction.getStoreZip());
            } else {
                preparedStatement.setNull(18, java.sql.Types.INTEGER);
                preparedStatement.setNull(19, java.sql.Types.VARCHAR);
                preparedStatement.setNull(20, java.sql.Types.VARCHAR);
                preparedStatement.setNull(21, java.sql.Types.VARCHAR);
                preparedStatement.setNull(22, java.sql.Types.VARCHAR);
            }
            preparedStatement.setString(23, transaction.getDeliveryOption());
            preparedStatement.setString(24, transaction.getOrderStatus());
       
            preparedStatement.executeUpdate();
        } 
    }

    public List<Transaction> getAllTransactions() throws SQLException {
        List<Transaction> transactions = new ArrayList<>();
        String query = "SELECT * FROM transactions"; 

        try (Connection connection = getConnection();
             Statement statement = connection.createStatement();
             ResultSet resultSet = statement.executeQuery(query)) {
                

            while (resultSet.next()) {
                Transaction transaction = new Transaction();
                transaction.setOrderId(resultSet.getString("order_id"));
                transaction.setUserId(resultSet.getInt("user_id"));
                transaction.setCustomerName(resultSet.getString("customer_name"));
                transaction.setStreet(resultSet.getString("street"));
                transaction.setCity(resultSet.getString("city"));
                transaction.setState(resultSet.getString("state"));
                transaction.setZipCode(resultSet.getString("zip_code"));
                transaction.setCreditCardNumber(resultSet.getString("credit_card_number"));
                transaction.setPurchaseDate(resultSet.getTimestamp("purchase_date"));
                transaction.setDeliveryDate(resultSet.getTimestamp("delivery_date"));
                transaction.setProductId(resultSet.getInt("product_id"));
                transaction.setCategory(resultSet.getString("category"));
                transaction.setQuantity(resultSet.getInt("quantity"));
                transaction.setPrice(resultSet.getDouble("price"));
                transaction.setShippingCost(resultSet.getDouble("shipping_cost"));
                transaction.setDiscount(resultSet.getDouble("discount"));
                transaction.setTotalSales(resultSet.getDouble("total_sales"));
                transaction.setStoreId(resultSet.getInt("store_id")); // If null, you may need to handle accordingly
                transaction.setStoreStreet(resultSet.getString("store_street"));
                transaction.setStoreCity(resultSet.getString("store_city"));
                transaction.setStoreState(resultSet.getString("store_state"));
                transaction.setStoreZip(resultSet.getString("store_zip"));
                transaction.setDeliveryOption(resultSet.getString("delivery_option"));
                transaction.setOrderStatus(resultSet.getString("order_status"));

                transactions.add(transaction);
            }
        }

        return transactions;
    }

    public List<Transaction> getTransactionsByUserId(int userId) throws SQLException {
    List<Transaction> transactions = new ArrayList<>();
    String query = "SELECT * FROM transactions WHERE user_id = ?"; 

    try (Connection connection = getConnection();
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
        
        preparedStatement.setInt(1, userId); 
        ResultSet resultSet = preparedStatement.executeQuery(); 

        while (resultSet.next()) {
            Transaction transaction = new Transaction();
            transaction.setOrderId(resultSet.getString("order_id"));
            transaction.setUserId(resultSet.getInt("user_id"));
            transaction.setCustomerName(resultSet.getString("customer_name"));
            transaction.setCreditCardNumber(resultSet.getString("credit_card_number"));
            transaction.setPurchaseDate(resultSet.getTimestamp("purchase_date"));
            transaction.setDeliveryDate(resultSet.getTimestamp("delivery_date"));
            transaction.setTotalSales(resultSet.getDouble("total_sales"));
            transaction.setDeliveryOption(resultSet.getString("delivery_option"));
            transaction.setOrderStatus(resultSet.getString("order_status"));
            
            transactions.add(transaction);
        }
    }

    return transactions;
}
    
    public boolean updateOrderStatus(Transaction transaction) throws SQLException {
    String query = "UPDATE transactions SET order_status = ? WHERE order_id = ?"; 

    try (Connection connection = getConnection();
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
        
        preparedStatement.setString(1, transaction.getOrderStatus());
        preparedStatement.setString(2, transaction.getOrderId());

        int rowsAffected = preparedStatement.executeUpdate();
        return rowsAffected > 0; 
    }
}

public boolean deleteOrder(String orderID) throws SQLException {
    String query = "DELETE FROM transactions WHERE order_id = ?"; 

    try (Connection connection = getConnection();
         PreparedStatement preparedStatement = connection.prepareStatement(query)) {
        
        preparedStatement.setString(1, orderID);
        int rowsAffected = preparedStatement.executeUpdate();
        return rowsAffected > 0; 
    }
}

       public List<Product> getMostLikedProducts() throws SQLException {
        List<Product> mostLikedProducts = new ArrayList<>();
        
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(GET_MOST_LIKED_PRODUCTS_SQL)) {
            ResultSet rs = ps.executeQuery();
            
            while (rs.next()) {
                Product product = new Product();
                product.setId(rs.getInt("id"));
                product.setName(rs.getString("name"));
                product.setDescription(rs.getString("description"));
                product.setPrice(rs.getDouble("price"));
                product.setLikes(rs.getInt("likes"));
                product.setRetailerSpecialDiscounts(rs.getDouble("retailer_special_discounts"));
                product.setManufacturerRebates(rs.getDouble("manufacturer_rebates"));
                product.setWarrantyPrice(rs.getDouble("warranty_price"));
                product.setCategory(rs.getString("category"));
                
                mostLikedProducts.add(product);
            }
        }
        return mostLikedProducts;
    }

    public void incrementLike(int productId) throws SQLException {
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(INCREMENT_LIKE_SQL)) {
            ps.setInt(1, productId);
            ps.executeUpdate();
        }
    }

    public void decrementLike(int productId) throws SQLException {
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(DECREMENT_LIKE_SQL)) {
            ps.setInt(1, productId);
            ps.executeUpdate();
        }
    }

    public int getLikeCount(int productId) throws SQLException {
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(GET_LIKE_COUNT_SQL)) {
            ps.setInt(1, productId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                return rs.getInt("likes");
            }
        }
        return 0; 
    }

   public Map<String, Integer> getTopFiveZipCodes() throws SQLException {
    Map<String, Integer> zipCodeCounts = new HashMap<>();

    String query = "SELECT zip_code, COUNT(*) as count FROM transactions GROUP BY zip_code ORDER BY count DESC LIMIT 5";

    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(query);
         ResultSet rs = stmt.executeQuery()) {

        while (rs.next()) {
            String zipCode = rs.getString("zip_code");
            int count = rs.getInt("count");
            zipCodeCounts.put(zipCode, count);
        }
    }

    return zipCodeCounts;
}

public Map<Integer, Integer> getTopFiveMostSoldProducts() throws SQLException {
    Map<Integer, Integer> productCounts = new HashMap<>();

    String query = "SELECT product_id, COUNT(*) as count FROM transactions GROUP BY product_id ORDER BY count DESC LIMIT 5";

    try (Connection conn = getConnection();
         PreparedStatement stmt = conn.prepareStatement(query);
         ResultSet rs = stmt.executeQuery()) {

        while (rs.next()) {
            int productId = rs.getInt("product_id");
            int count = rs.getInt("count");
            productCounts.put(productId, count);
        }
    }

    return productCounts;
}

   public List<ProductInventory> getProductInventory() throws SQLException {
    List<ProductInventory> inventory = new ArrayList<>();
    String query = "SELECT name, price, availableItems FROM products";
    
    try (Connection conn = getConnection();
         PreparedStatement pst = conn.prepareStatement(query);
         ResultSet rs = pst.executeQuery()) {
        
        while (rs.next()) {
            String name = rs.getString("name");
            double price = rs.getDouble("price");
            int availableItems = rs.getInt("availableItems");
            
            inventory.add(new ProductInventory(name, price, availableItems));
        }
    }
    return inventory;
}


}
