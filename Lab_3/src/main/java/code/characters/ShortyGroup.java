package code.characters;

import code.items.Rope;

import java.util.Objects;
import java.util.Random;

public class ShortyGroup extends Character {
    private final Random random = new Random();

    public ShortyGroup(Gender gender, String positionAlias, double height, double weight, int heartBeatFrequency) {
        super("Коротышки", gender, positionAlias, height, weight, heartBeatFrequency);
    }

    public String pullRope(Znayka znayka, Rope rope) {
        rope.pullCharacter(znayka, getPositionAlias());
        if (znayka.getWeight() < 90) {
            return (getName() + " принялись тянуть веревку и притянули " + znayka.getName() + " обратно к дому.\n");
        } else {
            return (getName() + " принялись тянуть веревку, но не смогли притянуть " + znayka.getName() + " обратно к дому с первого раза из-за " + znayka.getActionGenderText(code.characters.Action.PRONOUNS_HIS) + " большого веса.\n");
        }
    }


    @Override
    public void move(String newPositionAlias) {
        setPositionAlias(newPositionAlias);
    }

    @Override
    public String jump() {
        return (getName() + " плохо прыгают");
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ShortyGroup shorty = (ShortyGroup) o;
        return Objects.equals(getName(), shorty.getName()) && getGender() == shorty.getGender() && Objects.equals(getPositionAlias(), shorty.getPositionAlias()) && Double.compare(getHeight(), shorty.getHeight()) == 0 && Double.compare(getWeight(), shorty.getWeight()) == 0 && getHeartBeatFrequency() == shorty.getHeartBeatFrequency();
    }

    @Override
    public int hashCode() {
        return Objects.hash(getName(), getGender(), getPositionAlias(), getHeight(), getWeight(), getHeartBeatFrequency());
    }

    @Override
    public String toString() {
        return "Shorty{" +
                "name='" + getName() + '\'' +
                ", gender=" + getGender() +
                ", positionAlias='" + getPositionAlias() + '\'' +
                ", height=" + getHeight() +
                ", weight=" + getWeight() +
                ", heartBeatFrequency=" + getHeartBeatFrequency() +
                '}';
    }
}