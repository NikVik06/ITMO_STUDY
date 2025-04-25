package project.models;

/**
 * Класс представляет типы настроения
 */
public enum Mood {
    GLOOM,
    APATHY,
    CALM,
    RAGE,
    FRENZY;

    public static String getMood() {
        StringBuilder listMood = new StringBuilder();
        for (Mood mood : values()) {
            listMood.append(mood).append(", ");
        }
        return listMood.substring(0, listMood.length() - 2);
    }
}