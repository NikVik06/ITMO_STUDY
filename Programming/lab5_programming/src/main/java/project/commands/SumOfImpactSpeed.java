package project.commands;

import project.exceptions.WrongAmountOfElementsException;
import project.managers.CollectionManager;
import project.models.HumanBeing;
import project.structure.Console;

public class SumOfImpactSpeed extends Command {
    private final Console console;
    private final CollectionManager collectionManager;

    public SumOfImpactSpeed(Console console, CollectionManager collectionManager) {
        super("sum_of_impact_speed", "вывести сумму значений поля impactSpeed всех элементов коллекции");
        this.console = console;
        this.collectionManager = collectionManager;
    }

    @Override
    public boolean execute(String[] arguments) {
        double sum = collectionManager.getCollection().stream()
                .mapToDouble(HumanBeing::getImpactSpeed)
                .sum();
        console.println("Сумма значений impactSpeed: " + sum);
        return true;
    }
}