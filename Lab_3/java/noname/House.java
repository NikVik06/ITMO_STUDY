package noname;

import java.util.Objects;
import java.util.Random;


class House extends Building {
    private int height;
    private Random random = new Random();

    public House(String name) {
        super(name);
        this.height = random.nextInt(9) + 2;
    }

    public int getHeight() {
        return height;
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        House house = (House) o;
        return height == house.height && Objects.equals(getName(), house.getName()) && Objects.equals(getResidents(), house.getResidents());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getName(), getResidents(), height);
    }

    @Override
    public String toString() {
        return "House{" +
                "name='" + getName() + '\'' +
                ", residents=" + getResidents() +
                ", height=" + height +
                '}';
    }
}