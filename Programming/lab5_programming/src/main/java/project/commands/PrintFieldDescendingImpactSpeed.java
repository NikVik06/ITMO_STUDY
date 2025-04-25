package project.commands;

import project.exceptions.WrongAmountOfElementsException;
import project.managers.CollectionManager;
import project.models.HumanBeing;
import project.structure.Console;

import java.util.Comparator;

/**
 * Команда "print_field_descending_impact_speed"
 * Выводит значения поля impactSpeed всех элементов в порядке убывания
 */
public class PrintFieldDescendingImpactSpeed extends Command {
    private final Console console;
    private final CollectionManager collectionManager;

    public PrintFieldDescendingImpactSpeed(Console console, CollectionManager collectionManager) {
        super("print_field_descending_impact_speed",
                "вывести значения поля impactSpeed всех элементов в порядке убывания");
        this.console = console;
        this.collectionManager = collectionManager;
    }
    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments) {
        collectionManager.getCollection().stream()
                .mapToDouble(HumanBeing::getImpactSpeed)
                .boxed()
                .sorted(Comparator.reverseOrder())
                .forEach(speed -> console.println("" + speed));
        return true;
    }
}