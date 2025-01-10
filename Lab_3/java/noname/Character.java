package noname;
import java.util.Objects;

abstract class Character implements Movable, Jumpable {
    private String name;
    private Gender gender;
    private String positionAlias;
    private double height;
    private double weight;
    private int heartBeatFrequency;

    public Character(String name,Gender gender, String positionAlias, double height, double weight, int heartBeatFrequency) {
        this.name = name;
        this.gender = gender;
        this.positionAlias = positionAlias;
        this.height = height;
        this.weight = weight;
        this.heartBeatFrequency = heartBeatFrequency;
    }

    public String getName() {
        return name;
    }


    public Gender getGender(){
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public String getPositionAlias() {
        return positionAlias;
    }

    public void setPositionAlias(String positionAlias) {
        this.positionAlias = positionAlias;
    }

    public String getActionGenderText(Action action) {
        String actionGenderText = ActionTextFormer.getActionGenderText(action, gender);
        return actionGenderText != null ? actionGenderText : "Неизвестное действие или пол";

    }
    public double getHeight() {
        return height;
    }

    public void setHeight(double height) {
        this.height = height;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public int getHeartBeatFrequency() {
        return heartBeatFrequency;
    }

    public void setHeartBeatFrequency(int heartBeatFrequency) {
        this.heartBeatFrequency = heartBeatFrequency;
    }


    @Override
    public abstract void move(String newPositionAlias) ;


    @Override
    public abstract String jump();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Character character = (Character) o;
        return Double.compare(height, character.height) == 0 && Double.compare(weight, character.weight) == 0 && heartBeatFrequency == character.heartBeatFrequency && Objects.equals(name, character.name) && gender == character.gender && Objects.equals(positionAlias, character.positionAlias);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name,  gender, positionAlias, height, weight, heartBeatFrequency);
    }

    @Override
    public String toString() {
        return "Character{" +
                "name='" + name + '\'' +
                ", gender=" + gender +
                ", positionAlias='" + positionAlias + '\'' +
                ", height=" + height +
                ", weight=" + weight +
                ", heartBeatFrequency=" + heartBeatFrequency +
                '}';
    }
}