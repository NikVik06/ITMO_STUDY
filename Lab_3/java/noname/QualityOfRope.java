package noname;

public enum QualityOfRope {
    Slippery("скользкую"),
    Normal("надежную");
    private String property;

    QualityOfRope(String property) {
        this.property = property;
    }

    public String getProperty() {
        return property;
    }
    }
