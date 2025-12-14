package beans;

import dao.DatabaseManager;
import model.PointResult;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.SessionScoped;
import jakarta.inject.Inject;
import jakarta.inject.Named;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

@Named
@SessionScoped
public class AreaBean implements Serializable {
    private Double x;
    private Double y;
    private Double currentR;

    private Double graphX;
    private Double graphY;
    private boolean pointFromGraph = false;

    @Inject
    private ResultsManager resultsManager;

    @PostConstruct
    public void init() {
        try {
            if (currentR == null) {
                currentR = 2.0;
            }
            System.out.println("AreaBean initialized. Application has results");
        } catch (Exception e) {
            System.err.println("Error in AreaBean.init(): " + e.getMessage());
            e.printStackTrace();
        }
    }

    public void checkPoint() {
        try {
            Double checkX = this.x;
            Double checkY = this.y;
            Double checkR = this.currentR;

            if (pointFromGraph && graphX != null && graphY != null) {
                checkX = graphX;
                checkY = graphY;
                System.out.println("Using graph coordinates: X=" + graphX + ", Y=" + graphY + ", R=" + checkR);
            }

            if (checkX == null || checkY == null || checkR == null) {
                System.out.println("Missing coordinates: X=" + checkX + ", Y=" + checkY + ", R=" + checkR);
                pointFromGraph = false;
                return;
            }

            long startTime = System.nanoTime();
            boolean hit = checkHit(checkX, checkY, checkR);
            long executionTime = System.nanoTime() - startTime;

            PointResult result = new PointResult(checkX, checkY, checkR, hit, executionTime);

            DatabaseManager.saveResult(result);
            resultsManager.addResult(result);
            System.out.println("Point checked: " + checkX + ", " + checkY + ", " + checkR + " - Hit: " + hit);

        } catch (Exception e) {
            System.err.println("Error in checkPoint: " + e.getMessage());
            e.printStackTrace();
        } finally {
            if (pointFromGraph) {
                graphX = null;
                graphY = null;
                pointFromGraph = false;
            }
        }
    }

    public void checkPointFromGraph() {
        try {
            System.out.println("=== checkPointFromGraph called ===");
            System.out.println("graphX: " + graphX + ", graphY: " + graphY + ", currentR: " + currentR);

            if (graphX != null && graphY != null && currentR != null) {
                pointFromGraph = true;
                checkPoint();
            }
        } catch (Exception e) {
            System.err.println("Error in checkPointFromGraph: " + e.getMessage());
            e.printStackTrace();
        } finally {
            pointFromGraph = false;
        }
    }

    public void clearResults() {
        try {
            DatabaseManager.clearResults();
            resultsManager.clearAllResults();

            this.x = null;
            this.y = null;
            this.graphX = null;
            this.graphY = null;

            System.out.println("Results cleared");
        } catch (Exception e) {
            System.err.println("Error clearing results: " + e.getMessage());
            e.printStackTrace();
        }
    }

    private boolean checkHit(Double x, Double y, Double r) {
        if (x >= 0 && y >= 0 && (x*x + y*y) <= r*r) {
            return true;
        }
        if (x <= 0 && y <= 0 && y >= -x - r) {
            return true;
        }
        if (x >= 0 && y <= 0 && x <= r && y >= -r/2) {
            return true;
        }
        return false;
    }

    public Double getX() { return x; }
    public void setX(Double x) { this.x = x; }

    public Double getY() { return y; }
    public void setY(Double y) { this.y = y; }

    public Double getR() {
        if (currentR == null) {
            currentR = 2.0;
        }
        return currentR;
    }

    public void setR(Double r) {
        this.currentR = r;
        System.out.println("Current R set to: " + r);
    }

    public Double getGraphX() { return graphX; }
    public void setGraphX(Double graphX) { this.graphX = graphX; }

    public Double getGraphY() { return graphY; }
    public void setGraphY(Double graphY) { this.graphY = graphY; }

    public String getPointsJson() {
        try {
            List<PointResult> currentResults = resultsManager.getAllResults();
            if (currentResults.isEmpty()) {
                return "[]";
            }

            StringBuilder json = new StringBuilder("[");
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

            for (int i = 0; i < currentResults.size(); i++) {
                PointResult result = currentResults.get(i);
                if (i > 0) json.append(",");

                String timestampStr = result.getTimestamp() != null ?
                        sdf.format(result.getTimestamp()) :
                        sdf.format(new java.util.Date());

                json.append(String.format(Locale.US,
                        "{\"x\":%.3f,\"y\":%.3f,\"r\":%.1f,\"hit\":%b," +
                                "\"timestamp\":\"%s\",\"executionTime\":%d}",
                        result.getX(),
                        result.getY(),
                        result.getR(),
                        result.getHit(),
                        timestampStr,
                        result.getExecutionTime()));
            }
            json.append("]");
            return json.toString();
        } catch (Exception e) {
            System.err.println("Error in getPointsJson: " + e.getMessage());
            return "[]";
        }
    }

    public void setPointsJson(String pointsJson) {
    }

    public List<PointResult> getResults() {
        try {
            return resultsManager.getAllResults();
        } catch (Exception e) {
            System.err.println("Error in getResults: " + e.getMessage());
            return java.util.Collections.emptyList();
        }
    }
}