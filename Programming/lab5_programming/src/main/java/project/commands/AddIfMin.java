package project.commands;

import project.exceptions.IncorrectInputInScriptException;
import project.exceptions.InvalidCreaterException;
import project.exceptions.WrongAmountOfElementsException;
import project.managers.CollectionManager;
import project.models.HumanBeing;
import project.models.creater.HumanBeingCreater;
import project.structure.Console;

/**
 * Команда "add_if_min"
 * Добавляет новый элемент в коллекцию, если его цена меньше минимальной.
 */
public class AddIfMin extends Command {
    private final Console console;
    private final CollectionManager collectionManager;

    public AddIfMin(Console console, CollectionManager collectionManager) {
        super("add_if_min {element}", "добавить новый элемент в коллекцию, если его скорость удара меньше минимальной цены этой коллекции");
        this.console = console;
        this.collectionManager = collectionManager;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments) {
        try {
            if (!arguments[1].isEmpty()) throw new WrongAmountOfElementsException();
            console.println("Создание (add_if_min):");
            var humanBeing = (new HumanBeingCreater(console, collectionManager)).create();

            var minPrice = minImpactSpeed();
            if (humanBeing.getImpactSpeed() < minPrice) {
                collectionManager.addToCollection(humanBeing);
                console.println("Элемент успешно добавлен!");
            } else {
                console.println("Элемент не добавлен, скорость удара не минимальная (" + humanBeing.getImpactSpeed() + " > " + minImpactSpeed() +")");
            }
            return true;

        } catch (WrongAmountOfElementsException exception) {
            console.printError("Неправильное количество аргументов!");
            console.println("Использование: '" + getName() + "'");
        } catch (InvalidCreaterException exception) {
            console.printError("Поля элемента не валидны! Элемент не создан!");
        } catch (IncorrectInputInScriptException ignored) {}
        return false;
    }

    private double minImpactSpeed() {
        return collectionManager.getCollection().stream()
                .map(HumanBeing::getImpactSpeed)
                .mapToDouble(Double::doubleValue)
                .min()
                .orElse(Double.MAX_VALUE);
    }
}