package noname;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

abstract class Building {
    private String name;
    private List<String> residents;

    public Building(String name) {
        this.name = name;
        this.residents = new ArrayList<>();
    }

    public String getName() {
        return name;
    }

    public int getResidents() {
        return residents.size();
    }

    public void addResident(String resident) {
        this.residents.add(resident);
    }

    public void removeResident(String resident) {
        this.residents.remove(resident);
    }

    public void lookInside(String resident) {

    };

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Building building = (Building) o;
        return Objects.equals(name, building.name) && Objects.equals(residents, building.residents);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, residents);
    }

    @Override
    public String toString() {
        return "Building{" +
                "name='" + name + '\'' +
                ", residents=" + residents +
                '}';
    }
}