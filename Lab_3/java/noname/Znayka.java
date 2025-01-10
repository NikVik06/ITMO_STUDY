package noname;

import java.util.Objects;


class Znayka extends Character implements Climbable, Movable {
    private boolean isClimbing;
    private boolean isLookingAround;
    private boolean isFlying;

    public Znayka(Gender gender, String positionAlias, double height, double weight, int heartBeatFrequency) {
        super("Знайка", gender, positionAlias, height, weight, heartBeatFrequency);
        this.isClimbing = false;
        this.isLookingAround = false;
        this.isFlying = false;

    }


    public boolean getIsClimbing() {
        return isClimbing;
    }

    public void setClimbing(boolean climbing) {
        isClimbing = climbing;
    }

    public boolean getIsLookingAround() {
        return isLookingAround;
    }

    public void setLookingAround(boolean lookingAround) {
        isLookingAround = lookingAround;
    }

    public boolean getIsFlying() {
        return isFlying;
    }

    public void setFlying(boolean flying) {
        isFlying = flying;
    }

    public String lookInside(Building building) {
        return (getActionGenderText(Action.LOOK_AROUND));
    }

    public String climb(Drainpipe drainpipe) throws DrainpipeNotFoundException {
        if (drainpipe == null){
            throw new DrainpipeNotFoundException("Отсутствует водосточная труба");
        }
        else if (getHeartBeatFrequency() > 120) {
            setClimbing(true);
            setPositionAlias("крыша");
            return (getName() + " не " + getActionGenderText(Action.CLIMB) + " по трубе с первого раза на крышу из-за высокого пульса, в итоге");
        }
        else if (getWeight() > 90) {
            setClimbing(true);
            setPositionAlias("крыша");
            return (getName() + " не " + getActionGenderText(Action.CLIMB) + " по трубе с первого раза из-за большого веса, в итоге ");
        }
        else {
            setClimbing(true);
            setPositionAlias("крыша");
            return (getName() + " мгновенно " +  getActionGenderText(Action.CLIMB) + " по водосточной трубе на крышу ");
        }
    }

    public void fall() {
        setFlying(false);
        if (getHeight() > 1.85 || getWeight() > 90) {
            System.out.println(getName() + " " + getActionGenderText(Action.FALL) + " с высоты и получает легкие ушибы");
        }
        setPositionAlias("земля");
    }

    @Override
    public void move(String newPositionAlias) {
        setPositionAlias(newPositionAlias);
    }

    @Override
    public String jump() {
        return("Одним прыжком " + getName() + " " +  getActionGenderText(Action.JUMP) + " беседки и " + getActionGenderText(Action.LOOK_INSIDE) + " внутрь. ");
    }


    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Znayka znayka = (Znayka) o;
        return isClimbing == znayka.isClimbing && isLookingAround == znayka.isLookingAround && isFlying == znayka.getIsFlying() && Objects.equals(getName(), znayka.getName())  && getGender() == znayka.getGender()  && Objects.equals(getPositionAlias(),znayka.getPositionAlias()) && Double.compare(getHeight(), znayka.getHeight()) == 0 && Double.compare(getWeight(), znayka.getWeight()) == 0 && getHeartBeatFrequency() == znayka.getHeartBeatFrequency();
    }

    @Override
    public int hashCode() {
        return Objects.hash(getName(),  getGender(), isClimbing, isLookingAround, isFlying, getPositionAlias(),getHeight(), getWeight(),getHeartBeatFrequency());
    }

    @Override
    public String toString() {
        return "Znayka{" +
                "name='" + getName() + '\'' +
                ", gender=" + getGender() +
                ", positionAlias='" + getPositionAlias() + '\'' +
                ", height=" + getHeight() +
                ", weight=" + getWeight() +
                ", heartBeatFrequency=" + getHeartBeatFrequency() +
                ", isClimbing=" + isClimbing +
                ", isLookingAround=" + isLookingAround +
                ", isFlying=" + isFlying +
                '}';
        }
    }