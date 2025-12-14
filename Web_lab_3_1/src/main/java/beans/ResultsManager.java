package beans;

import dao.DatabaseManager;
import model.PointResult;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Named;
import java.io.Serializable;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Named
@ApplicationScoped
public class ResultsManager implements Serializable {
    private final List<PointResult> allResults = new CopyOnWriteArrayList<>();

    @PostConstruct
    public void init() {
        loadHistoricalResults();
        System.out.println("=== APPLICATION-SCOPED ResultsManager INITIALIZED ===");
        System.out.println("Loaded " + allResults.size() + " historical results from database");
    }

    private void loadHistoricalResults() {
        try {
            List<PointResult> historicalResults = DatabaseManager.getAllResults();
            allResults.addAll(historicalResults);
        } catch (Exception e) {
            System.err.println("Error loading historical results: " + e.getMessage());
        }
    }

    public void addResult(PointResult result) {
        allResults.add(result);
        System.out.println("Result added to Application-scoped bean. Total results: " + allResults.size());
    }

    public List<PointResult> getAllResults() {
        return Collections.unmodifiableList(allResults);
    }

    public void clearAllResults() {
        allResults.clear();
        System.out.println("All results cleared from Application-scoped bean");
    }

    public int getResultsCount() {
        return allResults.size();
    }
}