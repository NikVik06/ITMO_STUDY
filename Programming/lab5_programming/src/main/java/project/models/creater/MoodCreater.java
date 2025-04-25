package project.models.creater;

import project.exceptions.IncorrectInputInScriptException;
import project.models.Mood;
import project.structure.InputManager;
import project.structure.Console;
import java.util.NoSuchElementException;

/**
 * Структура настроения
 */
public class MoodCreater extends Creater<Mood> {
    private final Console console;

    public MoodCreater(Console console) {
        this.console = console;
    }

    @Override
    public Mood create() throws IncorrectInputInScriptException {
        var fileMode = InputManager.fileMode();

        String strMood;
        Mood mood;
        while (true) {
            try {
                console.println("Список типа настроения - " + Mood.getMood());
                console.println("Введите тип настроения:");
                console.ps2();

                strMood = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(strMood);

                mood = Mood.valueOf(strMood.toUpperCase());
                break;
            } catch (NoSuchElementException exception) {
                console.printError("Тип настроения не распознан!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (IllegalArgumentException exception) {
                console.printError("Типа настроения нет в списке!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (IllegalStateException exception) {
                console.printError("Непредвиденная ошибка!");
                System.exit(0);
            }
        }
        return mood;
    }
}