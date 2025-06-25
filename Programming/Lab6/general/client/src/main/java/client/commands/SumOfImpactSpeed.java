package client.commands;

import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.SumOfImpactSpeedRequest;
import transfer.commands.responses.SumOfImpactSpeedResponse;
import transfer.exceptions.APIException;
import transfer.exceptions.WrongAmountOfElementsException;

import java.io.IOException;


public class SumOfImpactSpeed extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public SumOfImpactSpeed(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("sum_of_impact_speed");
        this.consoleFunctional = consoleFunctional;
        this.client = client;
    }

    @Override
    public boolean execute(String[] arguments) {
        try {
            if (!arguments[1].isEmpty()) throw new WrongAmountOfElementsException();

            var response = (SumOfImpactSpeedResponse) client.sendAndReceiveCommand(new SumOfImpactSpeedRequest());
            if (response.getError() != null && !response.getError().isEmpty()) {
                throw new APIException(response.getError());
            }

            consoleFunctional.println("Сумма цен всех скоростей существ: " + response.sum);
            return true;

        } catch (WrongAmountOfElementsException exception) {
            consoleFunctional.printError("Неправильное количество аргументов!");
            consoleFunctional.println("Использование: '" + getName() + "'");
        } catch(IOException e) {
            consoleFunctional.printError("Ошибка взаимодействия с сервером");
        } catch (APIException e) {
            consoleFunctional.printError(e.getMessage());
        }
        return false;
    }
}