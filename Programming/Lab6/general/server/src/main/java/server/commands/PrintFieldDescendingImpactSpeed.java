package server.commands;


import server.controlCollection.HumanBeingRepository;
import transfer.base.HumanBeing;
import transfer.commands.requests.Request;
import transfer.commands.responses.PrintFieldDescendingImpactSpeedResponse;
import transfer.commands.responses.Response;

import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Команда "print_field_descending_impact_speed"
 * Выводит скорости всех существ в порядке убывания
 */
public class PrintFieldDescendingImpactSpeed extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public PrintFieldDescendingImpactSpeed(HumanBeingRepository humanBeingRepository) {
        super("print_field_descending_impact_speed",
                "вывести значения поля impactSpeed всех элементов в порядке убывания");
        this.humanBeingRepository = humanBeingRepository;
    }

    /**
     * Выполняет команду
     *
     * @return Результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        try {
            List<Double> impactSpeeds = humanBeingRepository.get().stream()
                    .map(HumanBeing::getImpactSpeed)
                    .sorted(Comparator.reverseOrder())
                    .collect(Collectors.toList());

            return new PrintFieldDescendingImpactSpeedResponse(impactSpeeds, null);

        } catch (Exception e) {
            return new PrintFieldDescendingImpactSpeedResponse(
                    null,
                    e.toString());
        }
    }
}