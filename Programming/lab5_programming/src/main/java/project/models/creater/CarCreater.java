package project.models.creater;

import project.exceptions.*;
import project.models.*;
import project.structure.InputManager;
import project.structure.Console;

import java.util.NoSuchElementException;

/**
 * Структура автомобиля
 */
public class CarCreater extends Creater<Car> {
    private final Console console;

    public CarCreater(Console console) {
        this.console = console;
    }

    @Override
    public Car create() throws IncorrectInputInScriptException, InvalidCreaterException {
        Boolean cool = requestAsk();

        var car = new Car(cool);
        if (!car.validate()) throw new InvalidCreaterException();
        return car;
    }

    /**
     * Запрашивает у пользователя, является ли автомобиль крутым
     * @return Boolean значение (true/false)
     * @throws IncorrectInputInScriptException Если запущен скрипт и возникает ошибка
     */
    public Boolean requestAsk() throws IncorrectInputInScriptException {
        Boolean cool;
        var fileMode = InputManager.fileMode();

        while (true) {
            try {
                console.println("Является ли автомобиль крутым? (true/false):");
                console.ps2();
                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(input);

                if (input.equalsIgnoreCase("true")) {
                    cool = true;
                    break;
                } else if (input.equalsIgnoreCase("false")) {
                    cool = false;
                    break;
                } else {
                    throw new InvalidInputException();
                }

            } catch (NoSuchElementException exception) {
                console.printError("Значение не распознано!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (InvalidInputException exception) {
                console.printError("Должно быть true или false!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (IllegalStateException exception) {
                console.printError("Непредвиденная ошибка!");
                System.exit(0);
            }
        }

        return cool;
    }
}