package model;

import java.io.Serializable;
import java.util.Date;

public class Result implements Serializable {
    private double x;
    private double y;
    private double r;
    private boolean hit;
    private Date timestamp;
    private long executionTime;

    public Result(double x, double y, double r, boolean hit, Date timestamp, long executionTime) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.hit = hit;
        this.timestamp = timestamp;
        this.executionTime = executionTime;
    }

    public double getX() { return x; }
    public double getY() { return y; }
    public double getR() { return r; }
    public boolean isHit() { return hit; }
    public Date getTimestamp() { return timestamp; }
    public long getExecutionTime() { return executionTime; }

    public void setX(double x) { this.x = x; }
    public void setY(double y) { this.y = y; }
    public void setR(double r) { this.r = r; }
    public void setHit(boolean hit) { this.hit = hit; }
    public void setTimestamp(Date timestamp) { this.timestamp = timestamp; }
    public void setExecutionTime(long executionTime) { this.executionTime = executionTime; }
}