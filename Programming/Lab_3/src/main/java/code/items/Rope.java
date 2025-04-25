package code.items;

import code.characters.Znayka;

import java.util.Objects;
import java.util.Random;

public class Rope {

    private final Random random = new Random();
    private QualityOfRope quality;

    public Rope() {
        this.quality = getRandomQuality();
    }

    public QualityOfRope getQuality() {
        return quality;
    }

    public void setQuality(QualityOfRope quality) {
        this.quality = quality;
    }

    public void pullCharacter(Znayka znayka, String housePosition) {
        znayka.setPositionAlias(housePosition);
    }

    private QualityOfRope getRandomQuality() {
        QualityOfRope[] qualities = QualityOfRope.values();
        return qualities[random.nextInt(qualities.length)];
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Rope rope = (Rope) o;
        return quality == rope.quality;
    }

    @Override
    public int hashCode() {
        return Objects.hash(quality);
    }

    @Override
    public String toString() {
        return "Rope{" +
                ", quality=" + quality.getRussianDescription() +
                '}';
    }
}