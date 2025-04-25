package project.commands;

import project.exceptions.CollectionIsEmptyException;
import project.exceptions.NotFoundException;
import project.exceptions.WrongAmountOfElementsException;
import project.managers.CollectionManager;
import project.structure.Console;

/**
 * Команда "remove_by_id {ID}"
 * Удаляет элемент из коллекции по ID
 */
public class RemoveById extends Command {
    private final Console console;
    private final CollectionManager collectionManager;

    public RemoveById(Console console, CollectionManager collectionManager) {
        super("remove_by_id {ID}", "удалить элемент из коллекции по ID");
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
            if (arguments[1].isEmpty()) throw new WrongAmountOfElementsException();
            if (collectionManager.sizeCollection() == 0) throw new CollectionIsEmptyException();

            var id = Integer.parseInt(arguments[1]);
            var productToRemove = collectionManager.getById(id);
            if (productToRemove == null) throw new NotFoundException();

            collectionManager.removeFromCollection(productToRemove);
            console.println("Продукт успешно удален.");
            return true;

        } catch (WrongAmountOfElementsException exception) {
            console.println("Использование: '" + getName() + "'");
        } catch (CollectionIsEmptyException exception) {
            console.printError("Коллекция пуста!");
        } catch (NumberFormatException exception) {
            console.printError("ID должен быть представлен числом!");
        } catch (NotFoundException exception) {
            console.printError("Продукта с таким ID в коллекции нет!");
        }
        return false;
    }
}