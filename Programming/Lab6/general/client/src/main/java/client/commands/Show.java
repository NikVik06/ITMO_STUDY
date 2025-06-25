package client.commands;

import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.ShowRequest;
import transfer.commands.responses.ShowResponse;
import transfer.exceptions.APIException;
import transfer.exceptions.WrongAmountOfElementsException;

import java.io.IOException;

/**
 * Команда "show"
 * Выводит все элементы коллекции
 */
public class Show extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public Show(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("show");
        this.consoleFunctional = consoleFunctional;
        this.client = client;
    }

    /**
     * Выполняет команду
     * @return результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments) {
        try {
            if (!arguments[1].isEmpty()) throw new WrongAmountOfElementsException();

            var response = (ShowResponse) client.sendAndReceiveCommand(new ShowRequest());
            if (response.getError() != null && !response.getError().isEmpty()) {
                throw new APIException(response.getError());
            }

            if (response.humanBeing.isEmpty()) {
                consoleFunctional.println("Коллекция пуста!");
                return true;
            }

            for (var humanBeings : response.humanBeing) {
                consoleFunctional.println(humanBeings + "\n");
            }
            return true;
        } catch (WrongAmountOfElementsException exception) {
            consoleFunctional.printError("Неправильное количество аргументов!");
            consoleFunctional.println("Использование: '" + getName() + "'");
        } catch (IOException e) {
            consoleFunctional.printError("Ошибка взаимодействия с сервером");
        } catch (APIException e) {
            consoleFunctional.printError(e.getMessage());
        }
        return false;
    }
}
