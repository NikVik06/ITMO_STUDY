package project.models.creater;

import project.exceptions.IncorrectInputInScriptException;
import project.exceptions.InvalidCreaterException;
import project.models.Coordinates;
import project.structure.Console;
import project.structure.InputManager;

import java.util.NoSuchElementException;
/**
 * Структура координат
 */
public class CoordinatesCreater extends Creater<Coordinates> {
    private final Console console;

    public CoordinatesCreater(Console console) {
        this.console = console;
    }

    @Override
    public Coordinates create() throws IncorrectInputInScriptException, InvalidCreaterException {
        var coordinates = new Coordinates(askX(), askY());
        if (!coordinates.validate()) throw new InvalidCreaterException();
        return coordinates;
    }

    /**
     * Запрашивает у пользователя координату X
     * @return Координата X
     * @throws IncorrectInputInScriptException Если запущен скрипт и возникает ошибка
     */
    public Integer askX() throws IncorrectInputInScriptException {
        var fileMode = InputManager.fileMode();
        int x;
        while (true) {
            try {
                console.println("Введите координату X:");
                console.ps2();
                var strX = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(strX);

                x = Integer.parseInt(strX);
                if (x >= 948) {
                    console.printError("Координата X должна быть меньше 948");
                    continue;  // Повторяем ввод
                }
                break;
            } catch (NoSuchElementException exception) {
                console.printError("Координата X не распознана");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (NumberFormatException exception) {
                console.printError("Координата X должна быть представлена числом");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (NullPointerException | IllegalStateException exception) {
                console.printError("Непредвиденная ошибка!");
                System.exit(0);
            }
        }
        return x;
    }

    /**
     * Запрашивает у пользователя координату Y.
     * @return Координата Y.
     * @throws IncorrectInputInScriptException Если запущен скрипт и возникает ошибка.
     */
    public Long askY() throws IncorrectInputInScriptException {
        var fileMode = InputManager.fileMode();
        long y;
        while (true) {
            try {
                console.println("Введите координату Y:");
                console.ps2();
                var strY = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(strY);

                y = Long.parseLong(strY);
                break;
            } catch (NoSuchElementException exception) {
                console.printError("Координата Y не распознана");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (NumberFormatException exception) {
                console.printError("Координата Y должна быть представлена числом!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (NullPointerException | IllegalStateException exception) {
                console.printError("Непредвиденная ошибка!");
                System.exit(0);
            }
        }
        return y;
    }
}