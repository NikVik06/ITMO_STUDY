package client.commands;

import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.RemoveByIdRequest;
import transfer.commands.requests.RemoveBySoundtrackNameRequest;
import transfer.commands.responses.RemoveByIdResponse;
import transfer.commands.responses.RemoveBySoundtrackNameResponse;
import transfer.exceptions.APIException;
import transfer.exceptions.WrongAmountOfElementsException;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
/**
 * Команда "remove_by_soundtrack_name {SOUNDTRACK_NAME}"
 * Удаляет из коллекции все элементы, значение поля soundTrack_Name которого эквивалентно заданному
 */
public class RemoveBySoundtrackName extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public RemoveBySoundtrackName(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("remove_by_soundtrack_name {SOUNDTRACK_NAME}");
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
            if (arguments.length != 2) {
                throw new WrongAmountOfElementsException();
            }

            String soundtrackName = arguments[1];
            if (soundtrackName.trim().isEmpty()) {
                throw new IllegalArgumentException("Название саундтрека не может быть пустым");
            }

            RemoveBySoundtrackNameResponse response = (RemoveBySoundtrackNameResponse)
                    client.sendAndReceiveCommand(
                            new RemoveBySoundtrackNameRequest(soundtrackName)
                    );

            if (response.getError() != null) {
                throw new APIException(response.getError());
            }

            if (response.removedCount > 0) {
                consoleFunctional.println("Удалено элементов: " + response.removedCount);
            } else {
                consoleFunctional.println("Существа с soundtrackName '" + soundtrackName + "' не найдены");
            }
            return true;

        } catch (WrongAmountOfElementsException e) {
            consoleFunctional.printError("Требуется 1 аргумент - название саундтрека");
            consoleFunctional.println("Использование: " + getName());
        } catch (IllegalArgumentException e) {
            consoleFunctional.printError(e.getMessage());
        } catch (APIException e) {
            consoleFunctional.printError("Ошибка сервера: " + e.getMessage());
        } catch (IOException e) {
            consoleFunctional.printError("Ошибка связи с сервером: " + e.getMessage());
        }
        return false;
    }
}
