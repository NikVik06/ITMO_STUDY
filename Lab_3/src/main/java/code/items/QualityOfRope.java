package code.items;

public enum QualityOfRope {
    SLIPPERY("скользкую"),
    NORMAL("надежную");
    private final String russianDescription;

    QualityOfRope(String russianDescription) {
        this.russianDescription = russianDescription;
    }

    public String getRussianDescription() {
        return russianDescription;
    }
}
