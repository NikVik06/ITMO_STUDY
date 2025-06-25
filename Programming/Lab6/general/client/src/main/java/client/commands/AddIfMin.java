package client.commands;
import client.creaters.HumanBeingCreater;
import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.AddIfMinRequest;
import transfer.commands.responses.AddIfMinResponse;
import transfer.exceptions.APIException;
import transfer.exceptions.*;


import java.io.IOException;

/**
 * Команда "add_if_min"
 * Добавляет новое существо в коллекцию, если его скорость меньше минимальной.
 */
public class AddIfMin extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public AddIfMin(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("add_if_min");
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
            consoleFunctional.println("Создание (add_if_min):");
            var newHumanBeing = (new HumanBeingCreater(consoleFunctional)).create();
            var response = (AddIfMinResponse) client.sendAndReceiveCommand(new AddIfMinRequest(newHumanBeing));
            if (response.getError() != null && !response.getError().isEmpty()) {
                throw new APIException(response.getError());
            }

            if (!response.isAdded) {
                consoleFunctional.println("Существо не добавлено, скорость  " + newHumanBeing.getImpactSpeed() + "не минимальная");
                return true;
            }

            consoleFunctional.println("Новое существо с id=" + response.newId + " успешно добавлено!");
            return true;

        } catch (WrongAmountOfElementsException exception) {
            consoleFunctional.printError("Неправильное количество аргументов!");
            consoleFunctional.println("Использование: '" + getName() + "'");
        } catch (InvalidCreaterException exception) {
            consoleFunctional.printError("Поля элемента не валидны! Элемент не создан!");
        } catch(IOException e) {
            consoleFunctional.printError("Ошибка взаимодействия с сервером");
        } catch (APIException e) {
            consoleFunctional.printError(e.getMessage());
        } catch (IncorrectInputInScriptException ignored) {}
        return false;
    }

}