package client.creaters;

import client.structure.ConsoleFunctional;
import transfer.base.Car;
import client.structure.InputManager;
import transfer.exceptions.*;
import java.util.NoSuchElementException;

/**
 * Структура автомобиля
 */
public class CarCreater extends Creater<Car> {
    private final ConsoleFunctional consoleFunctional;

    public CarCreater(ConsoleFunctional consoleFunctional) {
        this.consoleFunctional = consoleFunctional;
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
                consoleFunctional.println("Является ли автомобиль крутым? (true/false):");
                consoleFunctional.ps2();
                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(input);

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
                consoleFunctional.printError("Значение не распознано!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (InvalidInputException exception) {
                consoleFunctional.printError("Должно быть true или false!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (IllegalStateException exception) {
                consoleFunctional.printError("Непредвиденная ошибка!");
                System.exit(0);
            }
        }

        return cool;
    }
}