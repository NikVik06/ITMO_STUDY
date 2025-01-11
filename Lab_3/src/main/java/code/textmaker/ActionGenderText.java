package code.textmaker;

public enum ActionGenderText {
    JUMP_MALE("достиг"),
    JUMP_FEMALE("достигла"),
    CLIMB_MALE("вскарабкался"),
    CLIMB_FEMALE("вскарабкалась"),
    LOOK_INSIDE_MALE("заглянул"),
    LOOK_INSIDE_FEMALE("заглянула"),
    LOOK_AROUND_MALE("хотел оглядеться"),
    LOOK_AROUND_FEMALE("хотела оглядеться"),
    PRONOUNS_HE_MALE("он"),
    PRONOUNS_HE_FEMALE("она"),
    PRONOUNS_HIS_MALE("его"),
    PRONOUNS_HIS_FEMALE("её"),
    KNOW_MALE("знал"),
    KNOW_FEMALE("знала"),
    SAW_MALE("увидел"),
    SAW_FEMALE("увидела");


    private final String text;

    ActionGenderText(String text) {
        this.text = text;
    }


    public String getText() {
        return text;
    }

}
