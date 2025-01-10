package noname;

import java.util.Objects;
import java.util.Random;


class Wind {
    private int windForce;
    private WindDirection windDirection;
    private Random random = new Random();
    private boolean willBlow;

    public Wind() {
        this.windForce = random.nextInt(10) + 1; // Случайная сила ветра от 1 до 10
        this.windDirection = getRandomWindDirection();
        this.willBlow = random.nextBoolean(); // Случайно определяем, будет ли ветер сдувать
    }
    public int getWindForce() {
        return windForce;
    }
    public WindDirection getWindDirection() {
        return windDirection;
    }
    public boolean getWillBlow() {return willBlow;} // Добавили "public"

    protected WindDirection getRandomWindDirection() {
        WindDirection[] directions = WindDirection.values();
        return directions[random.nextInt(directions.length)];
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Wind wind = (Wind) o;
        return willBlow == wind.willBlow && windForce == wind.windForce && windDirection == wind.windDirection;
    }

    @Override
    public int hashCode() {
        return Objects.hash(windForce, windDirection, willBlow);
    }

    @Override
    public String toString() {
        return "Wind{" +
                "windForce=" + windForce +
                ", windDirection=" + windDirection +
                ", willBlow=" + willBlow +
                '}';
    }
}