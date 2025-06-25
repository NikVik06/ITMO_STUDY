package client.commands;

import client.creaters.HumanBeingCreater;
import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.AddRequest;
import transfer.commands.responses.AddResponse;
import transfer.exceptions.*;

import java.io.IOException;


/**
 * Команда "add"
 * Добавляет новый элемент в коллекцию
 */
public class Add extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public Add(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("add");
        this.consoleFunctional = consoleFunctional;
        this.client = client;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments)  {
        try {
            if (!arguments[1].isEmpty()) throw new WrongAmountOfElementsException();
            consoleFunctional.println("Создание нового существа:");

            var newHumanBeing = (new HumanBeingCreater(consoleFunctional)).create();
            var response = (AddResponse) client.sendAndReceiveCommand(new AddRequest(newHumanBeing));
            if (response.getError() != null && !response.getError().isEmpty()) {
                throw new APIException(response.getError());
            }

            consoleFunctional.println("Новое существо с id=" + response.newId + " успешно добавлен!");
            return true;

        } catch (WrongAmountOfElementsException exception) {
            consoleFunctional.printError("Неправильное количество аргументов!");
            consoleFunctional.println("Использование: '" + getName() + "'");
        } catch (InvalidCreaterException exception) {
            consoleFunctional.printError("Поля продукта не валидны! Существо не создано!");
        } catch(IOException e) {
            consoleFunctional.printError("Ошибка взаимодействия с сервером");
        } catch (APIException e) {
            consoleFunctional.printError(e.getMessage());
        } catch (IncorrectInputInScriptException ignored) {}
        return false;
    }
}
