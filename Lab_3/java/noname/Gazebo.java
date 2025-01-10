package noname;

// Класс беседки
import java.util.Objects;

class Gazebo extends Building {
    public Gazebo(String name) {
        super(name);
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Gazebo gazebo = (Gazebo) o;
        return Objects.equals(getName(), gazebo.getName()) && Objects.equals(getResidents(), gazebo.getResidents());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getName(), getResidents());
    }

    @Override
    public String toString() {
        return "Gazebo{" +
                "name='" + getName() + '\'' +
                ", residents=" + getResidents() +
                '}';
    }
}