package project.commands;


import project.exceptions.IncorrectInputInScriptException;
import project.exceptions.*;
import project.managers.CollectionManager;
import project.models.creater.HumanBeingCreater;
import project.structure.Console;

/**
 * Команда "update_by_id {element}"
 * Обновляет значение элемента коллекции по ID
 */
public class UpdateId extends Command {
    private final Console console;
    private final CollectionManager collectionManager;

    public UpdateId(Console console, CollectionManager collectionManager) {
        super("update_by_id {element}", "обновить значение элемента коллекции по ID");
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
            if (arguments[1].isEmpty()) throw new  WrongAmountOfElementsException();
            if (collectionManager.sizeCollection() == 0) throw new CollectionIsEmptyException();

            var id = Integer.parseInt(arguments[1]);
            var humanBeing = collectionManager.getById(id);
            if (humanBeing == null) throw new NotFoundException();

            console.println("* Введите данные обновленного элемента:");
            console.ps2();

            var newProduct = (new HumanBeingCreater(console, collectionManager)).create();
            humanBeing.update(newProduct);

            console.println("Элемент успешно обновлен.");
            return true;

        } catch (WrongAmountOfElementsException exception) {
            console.println("Использование: '" + getName() + "'");
        } catch (CollectionIsEmptyException exception) {
            console.printError("Коллекция пуста!");
        } catch (NumberFormatException exception) {
            console.printError("ID должен быть представлен числом!");
        } catch (NotFoundException exception) {
            console.printError("Элемента с таким ID в коллекции нет!");
        } catch (IncorrectInputInScriptException e) {
            e.printStackTrace();
        } catch (InvalidCreaterException e) {
            console.printError("Поля элемента не валидны! Элемент не обновлен!");
        }
        return false;
    }
}
