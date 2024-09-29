package model;

public class Product {
    private int id;
    private String name;
    private String description;
    private double price;
    private double retailerSpecialDiscounts;
    private double manufacturerRebates;
    private double warrantyPrice;
    private String category;
    private int likes;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public double getRetailerSpecialDiscounts() {
        return retailerSpecialDiscounts;
    }

    public void setRetailerSpecialDiscounts(double retailerSpecialDiscounts) {
        this.retailerSpecialDiscounts = retailerSpecialDiscounts;
    }

    public double getManufacturerRebates() {
        return manufacturerRebates;
    }

    public void setManufacturerRebates(double manufacturerRebates) {
        this.manufacturerRebates = manufacturerRebates;
    }

    public double getWarrantyPrice() {
        return warrantyPrice;
    }

    public void setWarrantyPrice(double warrantyPrice) {
        this.warrantyPrice = warrantyPrice;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getLikes() {
    return likes;
    }

    public void setLikes(int likes) {
    this.likes = likes;
    }
}
