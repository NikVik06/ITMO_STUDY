package noname;

public enum WindDirection {
    NORTH("северную"),
    SOUTH("южную"),
    EAST("восточную"),
    WEST("западную");

    private final String directionName;

    WindDirection(String directionName) {
        this.directionName = directionName;
    }

    public String getDirectionName() {
        return directionName;
    }
}