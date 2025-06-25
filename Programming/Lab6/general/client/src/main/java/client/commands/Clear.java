package client.commands;


import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.ClearRequest;
import transfer.commands.responses.ClearResponse;
import transfer.exceptions.APIException;
import transfer.exceptions.WrongAmountOfElementsException;
import java.io.IOException;

/**
 * Команда "clear"
 * Очищает коллекцию
 */
public class Clear extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public Clear(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("clear");
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

            var response = (ClearResponse) client.sendAndReceiveCommand(new ClearRequest());
            if (response.getError() != null && !response.getError().isEmpty()) {
                throw new APIException(response.getError());
            }

            consoleFunctional.println("Коллекция очищена!");
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
