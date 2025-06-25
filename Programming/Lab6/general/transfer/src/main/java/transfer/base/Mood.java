package transfer.base;
import client.creaters.MoodCreater;

import java.io.Serializable;
/**
 * Класс представляет типы настроения
 */
public enum Mood implements Serializable {
    GLOOM,
    APATHY,
    CALM,
    RAGE,
    FRENZY;

    /**
     *
     * @return
     */
    private static final long serialVersionUID = 1L;
    public static String getMood() {
        StringBuilder listMood = new StringBuilder();
        for (var mood : values()) {
            listMood.append(mood).append(", ");
        }
        return listMood.substring(0, listMood.length() - 2);
    }
}