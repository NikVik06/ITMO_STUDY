package client.commands;


import client.creaters.HumanBeingCreater;
import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.UpdateRequest;
import transfer.commands.responses.UpdateResponse;
import transfer.exceptions.APIException;
import transfer.exceptions.IncorrectInputInScriptException;
import transfer.exceptions.InvalidCreaterException;
import transfer.exceptions.WrongAmountOfElementsException;

import java.io.IOException;

/**
 * Команда "update_by_id {element}"
 * Обновляет значение элемента коллекции по ID
 */
public class UpdateId extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public UpdateId(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("update_by_id {element}");
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

            consoleFunctional.println("* Введите данные обновленного продукта:");
            var updatedHumanBeing = (new HumanBeingCreater(consoleFunctional)).create();

            var response = (UpdateResponse) client.sendAndReceiveCommand(new UpdateRequest(id, updatedHumanBeing));
            if (response.getError() != null && !response.getError().isEmpty()) {
                throw new APIException(response.getError());
            }

            consoleFunctional.println("Существо успешно обновлено.");
            return true;

        } catch (WrongAmountOfElementsException exception) {
            consoleFunctional.printError("Неправильное количество аргументов!");
            consoleFunctional.println("Использование: '" + getName() + "'");
        } catch (InvalidCreaterException exception) {
            consoleFunctional.printError("Поля существа не валидны! Существо не создано!");
        } catch (NumberFormatException exception) {
            consoleFunctional.printError("ID должен быть представлен числом!");
        } catch(IOException e) {
            consoleFunctional.printError("Ошибка взаимодействия с сервером");
        } catch (APIException e) {
            consoleFunctional.printError(e.getMessage());
        } catch (IncorrectInputInScriptException ignored) {}
        return false;
    }
}
