package client.commands;
import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.PrintDescendingRequest;
import transfer.commands.responses.PrintDescendingResponse;
import transfer.exceptions.APIException;
import transfer.exceptions.WrongAmountOfElementsException;
import java.io.IOException;

/**
 * Команда "print_descending"
 * Выводит существа коллекции в порядке убывания
 */
public class PrintDescending extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public PrintDescending(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("print_descending");
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

            var response = (PrintDescendingResponse) client.sendAndReceiveCommand(new PrintDescendingRequest());
            if (response.getError() != null) {
                throw new APIException(response.getError());
            }

            if (response.humanBeing.isEmpty()) {
                consoleFunctional.println("Коллекция пуста!");
                return true;
            }

            response.humanBeing.forEach(human ->
                    consoleFunctional.println(human + "\n")
            );
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