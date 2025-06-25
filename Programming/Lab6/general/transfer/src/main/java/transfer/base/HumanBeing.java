package transfer.base;

import java.io.Serializable;
import java.time.ZonedDateTime;
import java.util.Objects;
import java.util.concurrent.atomic.AtomicInteger;

import com.opencsv.bean.CsvBindByName;
import com.opencsv.bean.CsvCustomBindByName;
import client.structure.Validatable;
import server.converters.CarConverter;
import server.converters.CoordinatesConverter;
import server.converters.ZonedDateTimeConverter;

import java.io.Serial;

/**
 * Класс человеческой сущности
 * @author nikolenko-maxim
 */
public class HumanBeing implements Comparable<HumanBeing>, Validatable, Serializable {
    @Serial
    private static final long serialVersionUID = 1L;
    private static final AtomicInteger idCounter = new AtomicInteger(1);
    private final Integer id; //Поле не может быть null, Значение поля должно быть больше 0, Значение этого поля должно быть уникальным, Значение этого поля должно генерироваться автоматически
    @CsvBindByName(column = "NAME")
    private String name; //Поле не может быть null, Строка не может быть пустой
    @CsvCustomBindByName(column = "COORDINATES",converter = CoordinatesConverter.class)
    //@CsvQuoted
    private Coordinates coordinates; //Поле не может быть null
    @CsvCustomBindByName(column = "CREATIONDATE", converter = ZonedDateTimeConverter.class)
    private ZonedDateTime creationDate = ZonedDateTime.now(); //Поле не может быть null, Значение этого поля должно генерироваться автоматически
    @CsvBindByName(column = "REALHERO")
    private Boolean realHero; //Поле не может быть null
    @CsvBindByName(column = "HASTOOTHPICK")
    private boolean hasToothpick;
    @CsvBindByName(column = "IMPACTSPEED")
    private double impactSpeed;
    @CsvBindByName(column = "SOUNDTRACKNAME")
    private String soundtrackName; //Поле не может быть null
    @CsvBindByName(column = "MINUTESOFWAITING")
    private int minutesOfWaiting;
    @CsvBindByName(column = "MOOD")
    private Mood mood; //Поле может быть null
    @CsvCustomBindByName(column = "CAR", converter = CarConverter.class)
    private Car car;

    public HumanBeing() {
        this.id = idCounter.getAndIncrement();
        this.creationDate = ZonedDateTime.now();
        this.name = "Unnamed";
        this.coordinates = new Coordinates(0, 0);
        this.realHero = false;
        this.hasToothpick = false;
        this.impactSpeed = 0.0;
        this.soundtrackName = "Unknown";
        this.minutesOfWaiting = 0;
    }

    public HumanBeing(int id, String name, Coordinates coordinates, ZonedDateTime creationDate, Boolean realHero, boolean hasToothpick,
                      double impactSpeed, String soundtrackName, int minutesOfWaiting, Mood mood, Car car) {
        this.name = name;
        this.id = idCounter.getAndIncrement();
        this.coordinates = coordinates;
        this.creationDate = creationDate;
        this.realHero = realHero;
        this.hasToothpick = hasToothpick;
        this.impactSpeed = impactSpeed;
        this.soundtrackName = soundtrackName;
        this.minutesOfWaiting = minutesOfWaiting;
        this.mood = mood;
        this.car = car;
    }

    public HumanBeing copy(int id) {
        return new HumanBeing(
                id,
                this.name,
                this.coordinates,
                this.creationDate,
                this.realHero,
                this.hasToothpick,
                this.impactSpeed,
                this.soundtrackName,
                this.minutesOfWaiting,
                this.mood,
                this.car
        );
    }

    public Integer getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Coordinates getCoordinates() {
        return coordinates;
    }

    public ZonedDateTime getCreationDate() {
        return creationDate;
    }

    public Boolean getRealHero() {
        return realHero;
    }

    public boolean getHasToothpick() {
        return hasToothpick;
    }

    public double getImpactSpeed() {
        return impactSpeed;
    }

    public String getSoundtrackName() {
        return soundtrackName;
    }

    public int getMinutesOfWaiting() {
        return minutesOfWaiting;
    }

    public Mood getMood() {
        return mood;
    }

    public Car getCar() {
        return car;
    }
    /**
     * Обновляет указатель следующего ID
     */

    public void update(HumanBeing humanBeing) {
        this.name = humanBeing.name;
        this.coordinates = humanBeing.coordinates;
        this.creationDate = humanBeing.creationDate;
        this.realHero = humanBeing.realHero;
        this.hasToothpick = humanBeing.hasToothpick;
        this.impactSpeed = humanBeing.impactSpeed;
        this.soundtrackName = humanBeing.soundtrackName;
        this.minutesOfWaiting = humanBeing.minutesOfWaiting;
        this.mood = humanBeing.mood;
        this.car = humanBeing.car;

    }

    @Override
    public boolean validate() {
        if (id == null || id <= 0) return false;
        if (name == null || name.trim().isEmpty()) return false;
        if (coordinates == null) return false;
        if (creationDate == null) return false;
        if (realHero == null) return false;
        if (car != null && !car.validate()) {
            return false;
        }
        return soundtrackName == null || !soundtrackName.isEmpty();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        HumanBeing humanBeing = (HumanBeing) o;
        return id.equals(humanBeing.id) && Objects.equals(name, humanBeing.name) && Objects.equals(coordinates, humanBeing.coordinates)
                && Objects.equals(creationDate, humanBeing.creationDate) && Objects.equals(realHero, humanBeing.realHero)
                && Objects.equals(hasToothpick, humanBeing.hasToothpick) && Objects.equals(impactSpeed, humanBeing.impactSpeed)
                && Objects.equals(soundtrackName, humanBeing.soundtrackName) && Objects.equals(minutesOfWaiting, humanBeing.minutesOfWaiting)
                && Objects.equals(mood, humanBeing.mood) && Objects.equals(car, humanBeing.car);
    }

    @Override
    public int compareTo(HumanBeing other) {
        return Integer.compare(this.id, other.id);
    }
    @Override
    public int hashCode() {
        return Objects.hash(id, name, coordinates, creationDate, realHero, hasToothpick, impactSpeed, soundtrackName, minutesOfWaiting, mood, car);
    }

    @Override
    public String toString() {
        String description = "";
        description += "Человеческая сущность " + id;
        description += " (добавлен " + creationDate.toString() + ")";
        description += "\n Название: " + name;
        description += "\n Местоположение: " + coordinates;
        description += "\n Геройство: " + realHero;
        description += "\n Наличие зубочистки: " + hasToothpick;
        description += "\n Скорость удара: " + impactSpeed;
        description += "\n Название композиции:\n    " + ((soundtrackName == null) ? null : "'" + soundtrackName + "'");
        description += "\n Время ожидания(в минутах):\n    " + minutesOfWaiting;
        description += "\n Настроение:\n    " + ((mood == null) ? null : "'" + mood + "'");
        description += "\n Крутость машины:\n    " + ((car == null) ? null : "'" + car + "'");

        return description;
    }

}