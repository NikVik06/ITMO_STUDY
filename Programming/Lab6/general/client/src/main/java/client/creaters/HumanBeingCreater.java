package client.creaters;


import client.structure.ConsoleFunctional;
import client.structure.InputManager;
import transfer.base.*;
import transfer.exceptions.*;

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.NoSuchElementException;

/**
 * Структура человеческой сущности
 */
public class HumanBeingCreater extends Creater<HumanBeing> {
    private final ConsoleFunctional consoleFunctional;


    public HumanBeingCreater(ConsoleFunctional consoleFunctional) {
        this.consoleFunctional = consoleFunctional;

    }

    @Override
    public HumanBeing create() throws IncorrectInputInScriptException, InvalidCreaterException {
        var humanBeing = new HumanBeing(
                1,
                requestName(),
                requestCoordinates(),
                ZonedDateTime.now(),
                requestRealHero(),
                requestHasToothpick(),
                requestImpactSpeed(),
                requestSoundtrackName(),
                requestMinutesOfWaiting(),
                requestMood(),
                requestCar()
        );

        if (!humanBeing.validate()) throw new InvalidCreaterException();
        return humanBeing;
    }

    /**
     * Запрашивает имя персонажа
     * @return непустую строку с именем
     * @throws IncorrectInputInScriptException в скриптовом режиме при ошибке
     */
    private String requestName() throws IncorrectInputInScriptException {
        String name;
        var fileMode = InputManager.fileMode();
        while (true) {
            try {
                consoleFunctional.println("Введите имя персонажа:");
                consoleFunctional.ps2();

                name = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(name);
                if (name.isEmpty()) throw new MustBeNotEmptyException();
                break;
            } catch (MustBeNotEmptyException e) {
                consoleFunctional.printError("Имя не может быть пустым!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (NoSuchElementException e) {
                consoleFunctional.printError("Имя не распознано!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (IllegalStateException exception) {
                    consoleFunctional.printError("Непредвиденная ошибка!");
                    System.exit(0);
            }
        }
        return name;
    }
    /**
     * Запрашивает координаты через CoordinatesCreater
     * @return объект Coordinates
     * @throws IncorrectInputInScriptException в скриптовом режиме при ошибке
     * @throws InvalidCreaterException если координаты невалидны
     */
    private Coordinates requestCoordinates() throws IncorrectInputInScriptException, InvalidCreaterException {
        return new CoordinatesCreater(consoleFunctional).create();
    }
    /**
     * Запрашивает дату создания в формате yyyy-MM-ddTHH:mm:ss
     * @return объект ZonedDateTime
     */
    private ZonedDateTime requestCreationDate()  {
        ZonedDateTime creationDate;
        var fileMode = InputManager.fileMode();
        while (true) {
            try {
                consoleFunctional.println("Введите день рождения, например yyyy-MM-ddTHH:mm:ss): ");
                consoleFunctional.ps2();
                String date = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(date);
                if (date.isEmpty()) throw new MustBeNotEmptyException();

                creationDate = ZonedDateTime.parse(date);
                break;

            } catch (MustBeNotEmptyException e) {
                consoleFunctional.printError(e.toString());
                if (fileMode);
            } catch (IllegalStateException e) {
                consoleFunctional.printError("Непредвиденная ошибка!");
                System.exit(0);
            } catch (Exception e) {
                consoleFunctional.printError("Неверно ввели дату");
                if (fileMode);
            }
        }
        return creationDate;
    }
    /**
     * Запрашивает признак "реальный герой"
     * @return true/false
     * @throws IncorrectInputInScriptException в скриптовом режиме при ошибке
     */
    private Boolean requestRealHero() throws IncorrectInputInScriptException {
        var fileMode = InputManager.fileMode();
        while (true) {
            try {
                consoleFunctional.println("Это реальный герой? (true/false):");
                consoleFunctional.ps2();

                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(input);

                if (!input.equalsIgnoreCase("true") && !input.equalsIgnoreCase("false")) {
                    throw new InvalidInputException();
                }
                return Boolean.parseBoolean(input);
            } catch (InvalidInputException e) {
                consoleFunctional.printError("Должно быть true или false!");
                if (fileMode) throw new IncorrectInputInScriptException();
            }
        }
    }
    /**
     * Запрашивает наличие зубочистки
     * @return true/false
     * @throws IncorrectInputInScriptException в скриптовом режиме при ошибке
     */
    private boolean requestHasToothpick() throws IncorrectInputInScriptException {
        var fileMode = InputManager.fileMode();
        while (true) {
            try {
                consoleFunctional.println("Есть зубочистка? (true/false):");
                consoleFunctional.ps2();

                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(input);

                if (!input.equalsIgnoreCase("true") && !input.equalsIgnoreCase("false")) {
                    throw new InvalidInputException();
                }
                return Boolean.parseBoolean(input);
            } catch (InvalidInputException e) {
                consoleFunctional.printError("Должно быть true или false");
                if (fileMode) throw new IncorrectInputInScriptException();
            }
        }
    }
    /**
     * Запрашивает скорость удара
     * @return числовое значение скорости
     * @throws IncorrectInputInScriptException в скриптовом режиме при ошибке
     */
    private double requestImpactSpeed() throws IncorrectInputInScriptException {
        var fileMode = InputManager.fileMode();
        while (true) {
            try {
                consoleFunctional.println("Введите скорость удара:");
                consoleFunctional.ps2();

                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(input);

                return Double.parseDouble(input);
            } catch (NumberFormatException e) {
                consoleFunctional.printError("Должно быть числом");
                if (fileMode) throw new IncorrectInputInScriptException();
            }
        }
    }
    /**
     * Запрашивает название саундтрека
     * @return непустую строку
     * @throws IncorrectInputInScriptException в скриптовом режиме при ошибке
     */
    private String requestSoundtrackName() throws IncorrectInputInScriptException {
        String name;
        var fileMode = InputManager.fileMode();
        while (true) {
            try {
                consoleFunctional.println("Введите название саундтрека:");
                consoleFunctional.ps2();

                name = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(name);
                if (name.isEmpty()) throw new MustBeNotEmptyException();
                break;
            } catch (MustBeNotEmptyException e) {
                consoleFunctional.printError("Название не может быть пустым");
                if (fileMode) throw new IncorrectInputInScriptException();
            }
        }
        return name;
    }
    /**
     * Запрашивает минуты ожидания
     * @return целое число минут
     * @throws IncorrectInputInScriptException в скриптовом режиме при ошибке
     */
    private int requestMinutesOfWaiting() throws IncorrectInputInScriptException {
        var fileMode = InputManager.fileMode();
        while (true) {
            try {
                consoleFunctional.println("Введите минуты ожидания:");
                consoleFunctional.ps2();

                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(input);

                return Integer.parseInt(input);
            } catch (NumberFormatException e) {
                consoleFunctional.printError("Должно быть целым числом");
                if (fileMode) throw new IncorrectInputInScriptException();
            }
        }
    }
    /**
     * Запрашивает настроение из доступных значений  Mood
     * @return значение Mood или null
     * @throws IncorrectInputInScriptException в скриптовом режиме при ошибке
     */
    private Mood requestMood() throws IncorrectInputInScriptException {
        var fileMode = InputManager.fileMode();
        while (true) {
            try {
                consoleFunctional.println("Выберите настроение (" + Arrays.toString(Mood.values()) + " или null):");
                consoleFunctional.ps2();

                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) consoleFunctional.println(input);

                if (input.equalsIgnoreCase("null")) return null;

                try {
                    return Mood.valueOf(input.toUpperCase());
                } catch (IllegalArgumentException e) {
                    throw new InvalidInputException();
                }
            } catch (InvalidInputException e) {
                consoleFunctional.printError("Недопустимое значение настроения");
                if (fileMode) throw new IncorrectInputInScriptException();
            }
        }
    }
    /**
     * Запрашивает данные автомобиля через CarCreater
     * @return объект Car
     * @throws IncorrectInputInScriptException в скриптовом режиме при ошибке
     * @throws InvalidCreaterException если данные невалидны
     */
    private Car requestCar() throws IncorrectInputInScriptException, InvalidCreaterException {
        return new CarCreater(consoleFunctional).create();
    }
}