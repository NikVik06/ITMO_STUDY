package client.commands;

import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.PrintFieldDescendingImpactSpeedRequest;
import transfer.commands.responses.PrintFieldDescendingImpactSpeedResponse;
import transfer.exceptions.APIException;
import transfer.exceptions.WrongAmountOfElementsException;

/**
 * Команда "print_field_descending_impact_speed"
 * Выводит значения поля impactSpeed всех элементов в порядке убывания
 */
public class PrintFieldDescendingImpactSpeed extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public PrintFieldDescendingImpactSpeed(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("print_field_descending_impact_speed");
        this.consoleFunctional = consoleFunctional;
        this.client = client;
    }
    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments) {
        try {
            if (!arguments[1].isEmpty()) throw new WrongAmountOfElementsException();

            var response = (PrintFieldDescendingImpactSpeedResponse)
                    client.sendAndReceiveCommand(new PrintFieldDescendingImpactSpeedRequest());

            if (response.getError() != null) {
                throw new APIException(response.getError());
            }

            if (response.impactSpeeds == null || response.impactSpeeds.isEmpty()) {
                consoleFunctional.println("Коллекция пуста!");
                return true;
            }

            consoleFunctional.println("Значения impactSpeed (по убыванию):");
            response.impactSpeeds.forEach(speed ->
                    consoleFunctional.println(String.format("%.1f", speed))
            );
            return true;

        }
        catch (WrongAmountOfElementsException e) {
            consoleFunctional.printError("Команда не требует аргументов!");
        }
        catch (Exception e) {
            consoleFunctional.printError("Ошибка: " + e.getMessage());
        }
        return false;
    }
}