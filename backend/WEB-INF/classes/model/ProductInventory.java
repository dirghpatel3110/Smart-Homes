package model;

public class ProductInventory {
    private String name;
    private double price;
    private int availableItems;

    public ProductInventory(String name, double price, int availableItems) {
        this.name = name;
        this.price = price;
        this.availableItems = availableItems;
    }

    public String getName() {
        return name;
    }

    // Setter for name
    public void setName(String name) {
        this.name = name;
    }

    // Getter for price
    public double getPrice() {
        return price;
    }

    // Setter for price
    public void setPrice(double price) {
        this.price = price;
    }

    // Getter for availableItems
    public int getAvailableItems() {
        return availableItems;
    }

    // Setter for availableItems
    public void setAvailableItems(int availableItems) {
        this.availableItems = availableItems;
    }

}