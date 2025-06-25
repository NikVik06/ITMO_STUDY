package client.creaters;

import client.structure.ConsoleFunctional;
import client.structure.InputManager;
import transfer.exceptions.*;
import transfer.base.Mood;


import java.util.NoSuchElementException;

/**
 * Структура настроения
 */
public class MoodCreater extends Creater<Mood> {
    private final ConsoleFunctional consoleFunctional;

    public MoodCreater(ConsoleFunctional consoleFunctional) {
        this.consoleFunctional = consoleFunctional;
    }


    @Override
    public Mood create() throws IncorrectInputInScriptException {
        var fileMode = InputManager.fileMode();

        String strMood;
        Mood mood;
        while (true) {
            try {
                consoleFunctional.println("Список типа настроения - " + Mood.getMood());
                consoleFunctional.println("Введите тип настроения:");
                consoleFunctional.ps2();

                strMood = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(strMood);

                mood = Mood.valueOf(strMood.toUpperCase());
                break;
            } catch (NoSuchElementException exception) {
                consoleFunctional.printError("Тип настроения не распознан!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (IllegalArgumentException exception) {
                consoleFunctional.printError("Типа настроения нет в списке!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (IllegalStateException exception) {
                consoleFunctional.printError("Непредвиденная ошибка!");
                System.exit(0);
            }
        }
        return mood;
    }
}