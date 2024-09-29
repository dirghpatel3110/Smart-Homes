package model;

import java.util.List;

public class Cart {
    private int id;
    private int userId;
    private int productId;
    private String productName;
    private int quantity;
    private double price;
    private String category;
    private double warranty;
    private double discount;
    private List<Accessory> accessories;

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    public int getProductId() { return productId; }
    public void setProductId(int productId) { this.productId = productId; }
    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public double getWarranty() {
        return warranty;
    }

    public void setWarranty(double warranty) {
        this.warranty = warranty;
    }
    public double getDiscount() { return discount; }
    public void setDiscount(double discount) { this.discount = discount; }
    public List<Accessory> getAccessories() { return accessories; }
    public void setAccessories(List<Accessory> accessories) { this.accessories = accessories; }
}