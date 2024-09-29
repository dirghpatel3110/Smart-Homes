package model;

import java.util.List;

public class TopResults {
    private List<String> topZipCodes;
    private List<Integer> topZipCodeCounts; 
    private List<Integer> topProducts; 
    private List<Integer> topProductCounts; 

    public TopResults(List<String> topZipCodes, List<Integer> topZipCodeCounts, 
                      List<Integer> topProducts, List<Integer> topProductCounts) {
        this.topZipCodes = topZipCodes;
        this.topZipCodeCounts = topZipCodeCounts;
        this.topProducts = topProducts;
        this.topProductCounts = topProductCounts;
    }

    public List<String> getTopZipCodes() {
        return topZipCodes;
    }

    public List<Integer> getTopZipCodeCounts() {
        return topZipCodeCounts;
    }

    public List<Integer> getTopProducts() {
        return topProducts;
    }

    public List<Integer> getTopProductCounts() {
        return topProductCounts;
    }
}
