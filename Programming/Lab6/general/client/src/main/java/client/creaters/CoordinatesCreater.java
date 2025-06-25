package client.creaters;

import client.structure.ConsoleFunctional;
import transfer.exceptions.*;
import transfer.base.Coordinates;
import client.structure.InputManager;

import java.util.NoSuchElementException;
/**
 * Структура координат
 */
public class CoordinatesCreater extends Creater<Coordinates> {
    private final ConsoleFunctional consoleFunctional;

    public CoordinatesCreater(ConsoleFunctional consoleFunctional) {
        this.consoleFunctional = consoleFunctional;
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
                consoleFunctional.println("Введите координату X:");
                consoleFunctional.ps2();
                var strX = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(strX);

                x = Integer.parseInt(strX);
                if (x >= 948) {
                    consoleFunctional.printError("Координата X должна быть меньше 948");
                    continue;  // Повторяем ввод
                }
                break;
            } catch (NoSuchElementException exception) {
                consoleFunctional.printError("Координата X не распознана");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (NumberFormatException exception) {
                consoleFunctional.printError("Координата X должна быть представлена числом");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (NullPointerException | IllegalStateException exception) {
                consoleFunctional.printError("Непредвиденная ошибка!");
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
                consoleFunctional.println("Введите координату Y:");
                consoleFunctional.ps2();
                var strY = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(strY);

                y = Long.parseLong(strY);
                break;
            } catch (NoSuchElementException exception) {
                consoleFunctional.printError("Координата Y не распознана");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (NumberFormatException exception) {
                consoleFunctional.printError("Координата Y должна быть представлена числом!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (NullPointerException | IllegalStateException exception) {
                consoleFunctional.printError("Непредвиденная ошибка!");
                System.exit(0);
            }
        }
        return y;
    }
}