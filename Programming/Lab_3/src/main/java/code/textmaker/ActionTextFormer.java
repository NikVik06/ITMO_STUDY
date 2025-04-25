package code.textmaker;

import code.characters.Action;
import code.characters.Gender;

public class ActionTextFormer {
    public static String getActionGenderText(Action action, Gender gender) {
        String actionName = action.name();
        String genderName = gender.name();
        String actionGenderName = actionName + "_" + genderName;

        try {
            ActionGenderText actionGenderText = ActionGenderText.valueOf(actionGenderName);
            return actionGenderText.getText();
        } catch (IllegalArgumentException e) {
            System.err.println("Неизвестное действие или пол: " + actionGenderName);
            return null;
        }
    }
}
