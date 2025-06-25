package client.commands;


import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.RemoveByIdRequest;
import transfer.commands.responses.RemoveByIdResponse;
import transfer.exceptions.APIException;
import transfer.exceptions.WrongAmountOfElementsException;

import java.io.IOException;

/**
 * Команда "remove_by_id {ID}"
 * Удаляет элемент из коллекции по ID
 */
public class RemoveById extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public RemoveById(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("remove_by_id {ID}");
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
            if (arguments[1].isEmpty()) throw new WrongAmountOfElementsException();
            var id = Integer.parseInt(arguments[1]);

            var response = (RemoveByIdResponse) client.sendAndReceiveCommand(new RemoveByIdRequest(id));
            if (response.getError() != null) {
                throw new APIException(response.getError());
            }

            if (response.success) {
                consoleFunctional.println("Существо с ID " + id + " успешно удален");
            } else {
                consoleFunctional.printError("Не удалось удалить элемент с ID " + id);
            }
            return response.success;
        } catch (WrongAmountOfElementsException exception) {
            consoleFunctional.printError("Неправильное количество аргументов!");
            consoleFunctional.println("Использование: '" + getName() + "'");
        } catch (NumberFormatException exception) {
            consoleFunctional.printError("ID должен быть представлен числом!");
        } catch(IOException e) {
            consoleFunctional.printError("Ошибка взаимодействия с сервером");
        } catch (APIException e) {
            consoleFunctional.printError(e.getMessage());
        }
        return false;
    }
}