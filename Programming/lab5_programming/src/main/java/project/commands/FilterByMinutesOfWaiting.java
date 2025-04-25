package project.commands;

import project.exceptions.WrongAmountOfElementsException;
import project.managers.CollectionManager;
import project.models.HumanBeing;
import project.structure.Console;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Команда "filter_by_minutes_of_waiting"
 * Сортировка элементов по минутам
 */
public class FilterByMinutesOfWaiting extends Command {
    private final Console console;
    private final CollectionManager collectionManager;

    public FilterByMinutesOfWaiting(Console console, CollectionManager collectionManager) {
        super("filter_by_minutes_of_waiting {MINUTESOFWAITING}", "вывести элементы, значение поля minutesOfWaiting которых равно заданному");
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
            if (arguments.length < 2 || arguments[1].isEmpty()) throw new WrongAmountOfElementsException();

            int minutesOfWaiting = Integer.parseInt(arguments[1]);
            List<HumanBeing> filtered = filterByMinutesOfWaiting(minutesOfWaiting);

            if (filtered.isEmpty()) {
                console.println("Элементов с minutesOfWaiting = " + minutesOfWaiting + " не обнаружено.");
            } else {
                console.println("Найдено элементов: " + filtered.size());
                filtered.forEach(console::println);
            }
            return true;

        } catch (NumberFormatException exception) {
            console.printError("Количество минут должно быть целым числом!");
        } catch (WrongAmountOfElementsException exception) {
            console.printError("Неправильное количество аргументов!");
            console.println("Использование: '" + getName() + "'");
        }
        return false;
    }

    private List<HumanBeing> filterByMinutesOfWaiting(int minutes) {
        return collectionManager.getCollection().stream()
                .filter(h -> h.getMinutesOfWaiting() == minutes)
                .collect(Collectors.toList());
    }
}
