package project.commands;

import project.exceptions.WrongAmountOfElementsException;
import project.managers.CollectionManager;
import project.structure.Console;

/**
 * Команда "print_ascending"
 * Выводит элементы коллекции в порядке возрастания
 */
public class PrintAscending extends Command {
    private final Console console;
    private final CollectionManager collectionManager;

    public PrintAscending(Console console, CollectionManager collectionManager) {
        super("print_ascending", "вывести элементы коллекции в порядке возрастания");
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
            if (arguments.length > 1) throw new WrongAmountOfElementsException();

            if (collectionManager.sizeCollection() == 0) {
                console.println("Коллекция пуста!");
                return true;
            }

            console.println("Элементы коллекции в порядке возрастания:");
            collectionManager.getCollection().forEach(console::println);

            return true;

        } catch (WrongAmountOfElementsException exception) {
            console.printError("Эта команда не принимает аргументов!");
            console.println("Использование: '" + getName() + "'");
        }
        return false;
    }
}