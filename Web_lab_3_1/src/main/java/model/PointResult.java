package model;

import java.io.Serializable;
import java.util.Date;

public class PointResult implements Serializable {
    private Double x;
    private Double y;
    private Double r;
    private Boolean hit;
    private Date timestamp;
    private Long executionTime;

    public PointResult() {
        this.x = null;
        this.y = null;
        this.r = null;
        this.hit = null;
        this.timestamp = null;
        this.executionTime = null;
    }

    public PointResult(Double x, Double y, Double r, Boolean hit, Long executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.timestamp = new Date();
        this.executionTime = executionTime;
    }

    public Double getX() { return x; }

    public Double getY() { return y; }

    public Double getR() { return r; }

    public Boolean getHit() { return hit; }

    public Date getTimestamp() { return timestamp; }

    public Long getExecutionTime() { return executionTime; }

    public void setX(Double x) { this.x = x; }
    public void setY(Double y) { this.y = y; }
    public void setR(Double r) { this.r = r; }
    public void setHit(Boolean hit) { this.hit = hit; }
    public void setTimestamp(Date timestamp) {
        if (this.timestamp == null) {
            this.timestamp = timestamp;
        }
    }
    public void setExecutionTime(Long executionTime) {
        if (this.executionTime == null) {
            this.executionTime = executionTime;
        }
    }
}