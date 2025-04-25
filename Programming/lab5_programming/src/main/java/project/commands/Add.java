package project.commands;

import project.exceptions.IncorrectInputInScriptException;
import project.exceptions.InvalidCreaterException;
//import project.exceptions.WrongAmountOfElementsException;
import project.exceptions.WrongAmountOfElementsException;
import project.managers.CollectionManager;
import project.models.creater.HumanBeingCreater;
import project.structure.Console;

/**
 * Команда "add"
 * Добавляет новый элемент в коллекцию
 */
public class Add extends Command {
    private final Console console;
    private final CollectionManager collectionManager;

    public Add(Console console, CollectionManager collectionManager) {
        super("add {element}", "добавить новый элемент в коллекцию");
        this.console = console;
        this.collectionManager = collectionManager;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments)  {
        try {
            if (!arguments[1].isEmpty()) throw new WrongAmountOfElementsException();
            console.println("Создание человеческого существа :");
            collectionManager.addToCollection((new HumanBeingCreater(console, collectionManager)).create());
            console.println("Элемент успешно добавлен!");
            return true;

        } catch (WrongAmountOfElementsException exception) {
            console.printError("Неправильное количество аргументов!");
            console.println("Использование: '" + getName() + "'");
        } catch (InvalidCreaterException exception) {
            console.printError("Поля элемента не валидны! Элемент не создан!");
        } catch (IncorrectInputInScriptException ignored) {
        }
        return false;
    }
}
