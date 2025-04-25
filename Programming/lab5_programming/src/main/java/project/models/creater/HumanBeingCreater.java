package project.models.creater;

import project.exceptions.*;
import project.managers.CollectionManager;
import project.models.*;
import project.structure.Console;
import project.structure.InputManager;

import java.time.ZonedDateTime;
import java.util.Arrays;
import java.util.NoSuchElementException;

/**
 * Структура человеческой сущности
 */
public class HumanBeingCreater extends Creater<HumanBeing> {
    private final Console console;
    private final CollectionManager collectionManager;


    public HumanBeingCreater(Console console, CollectionManager collectionManager) {
        this.console = console;
        this.collectionManager = collectionManager;
    }

    @Override
    public HumanBeing create() throws IncorrectInputInScriptException, InvalidCreaterException {
        var humanBeing = new HumanBeing(
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
                console.println("Введите имя персонажа:");
                console.ps2();

                name = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(name);
                if (name.isEmpty()) throw new MustBeNotEmptyException();
                break;
            } catch (MustBeNotEmptyException e) {
                console.printError("Имя не может быть пустым!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (NoSuchElementException e) {
                console.printError("Имя не распознано!");
                if (fileMode) throw new IncorrectInputInScriptException();
            } catch (IllegalStateException exception) {
                    console.printError("Непредвиденная ошибка!");
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
        return new CoordinatesCreater(console).create();
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
                console.println("Введите день рождения, например yyyy-MM-ddTHH:mm:ss): ");
                console.ps2();
                String date = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(date);
                if (date.isEmpty()) throw new MustBeNotEmptyException();

                creationDate = ZonedDateTime.parse(date);
                break;

            } catch (MustBeNotEmptyException e) {
                console.printError(e.toString());
                if (fileMode);
            } catch (IllegalStateException e) {
                console.printError("Непредвиденная ошибка!");
                System.exit(0);
            } catch (Exception e) {
                console.printError("Неверно ввели дату");
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
                console.println("Это реальный герой? (true/false):");
                console.ps2();

                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(input);

                if (!input.equalsIgnoreCase("true") && !input.equalsIgnoreCase("false")) {
                    throw new InvalidInputException();
                }
                return Boolean.parseBoolean(input);
            } catch (InvalidInputException e) {
                console.printError("Должно быть true или false!");
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
                console.println("Есть зубочистка? (true/false):");
                console.ps2();

                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(input);

                if (!input.equalsIgnoreCase("true") && !input.equalsIgnoreCase("false")) {
                    throw new InvalidInputException();
                }
                return Boolean.parseBoolean(input);
            } catch (InvalidInputException e) {
                console.printError("Должно быть true или false");
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
                console.println("Введите скорость удара:");
                console.ps2();

                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(input);

                return Double.parseDouble(input);
            } catch (NumberFormatException e) {
                console.printError("Должно быть числом");
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
                console.println("Введите название саундтрека:");
                console.ps2();

                name = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(name);
                if (name.isEmpty()) throw new MustBeNotEmptyException();
                break;
            } catch (MustBeNotEmptyException e) {
                console.printError("Название не может быть пустым");
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
                console.println("Введите минуты ожидания:");
                console.ps2();

                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(input);

                return Integer.parseInt(input);
            } catch (NumberFormatException e) {
                console.printError("Должно быть целым числом");
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
                console.println("Выберите настроение (" + Arrays.toString(Mood.values()) + " или null):");
                console.ps2();

                String input = InputManager.getUserScanner().nextLine().trim();
                if (fileMode) console.println(input);

                if (input.equalsIgnoreCase("null")) return null;

                try {
                    return Mood.valueOf(input.toUpperCase());
                } catch (IllegalArgumentException e) {
                    throw new InvalidInputException();
                }
            } catch (InvalidInputException e) {
                console.printError("Недопустимое значение настроения");
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
        return new CarCreater(console).create();
    }
}