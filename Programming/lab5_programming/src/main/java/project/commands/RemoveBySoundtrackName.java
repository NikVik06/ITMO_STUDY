package project.commands;

import project.exceptions.CollectionIsEmptyException;
import project.exceptions.WrongAmountOfElementsException;
import project.managers.CollectionManager;
import project.models.HumanBeing;
import project.structure.Console;

import java.util.List;
import java.util.stream.Collectors;
/**
 * Команда "remove_by_soundtrack_name {SOUNDTRACKNAME}"
 * Удаляет из коллекции все элементы, значение поля soundTrackName которого эквивалентно заданному
 */
public class RemoveBySoundtrackName extends Command {
    private final Console console;
    private final CollectionManager collectionManager;

    public RemoveBySoundtrackName(Console console, CollectionManager collectionManager) {
        super("remove_by_soundtrack_name {SOUNDTRACKNAME}",
                " удалить из коллекции все элементы, значение поля soundTrackName которого эквивалентно заданному");
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
            if (arguments.length < 2 || arguments[1].isEmpty()) {
                throw new WrongAmountOfElementsException();
            }

            String soundtrackName = arguments[1];
            List<HumanBeing> toRemove = collectionManager.getCollection().stream()
                    .filter(h -> h.getSoundtrackName() != null && h.getSoundtrackName().equals(soundtrackName))
                    .collect(Collectors.toList());

            if (toRemove.isEmpty()) {
                console.printError("Элементов с soundtrackName '" + soundtrackName + "' не найдено!");
                return false;
            }

            toRemove.forEach(collectionManager::removeFromCollection);
            console.println("Элемент удален: " + toRemove.size());
            return true;

        } catch (WrongAmountOfElementsException exception) {
            console.printError("Неправильное количество аргументов!");
            console.println("Использование: '" + getName() + "'");
        }
        return false;
    }
}
