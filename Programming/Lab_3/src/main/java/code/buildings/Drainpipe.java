package code.buildings;

import java.util.Objects;

public class Drainpipe {
    private final Building attachedToBuilding;

    public Drainpipe(Building building) {
        this.attachedToBuilding = building;
    }

    public Building getAttachedToBuilding() {
        return attachedToBuilding;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Drainpipe drainpipe = (Drainpipe) o;
        return Objects.equals(attachedToBuilding, drainpipe.attachedToBuilding);
    }

    @Override
    public int hashCode() {
        return Objects.hash(attachedToBuilding);
    }

    @Override
    public String toString() {
        return "Drainpipe{" +
                "attachedToBuilding=" + attachedToBuilding +
                '}';
    }
}