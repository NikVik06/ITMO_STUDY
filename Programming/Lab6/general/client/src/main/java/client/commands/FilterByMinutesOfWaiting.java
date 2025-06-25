package client.commands;

import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.FilterByMinutesOfWaitingRequest;
import transfer.commands.responses.FilterByMinutesOfWaitingResponse;
import transfer.exceptions.APIException;
import transfer.exceptions.WrongAmountOfElementsException;
import java.io.IOException;

/**
 * Команда "filter_by_minutes_of_waiting"
 * Сортировка существ по минутам
 */
public class FilterByMinutesOfWaiting extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public FilterByMinutesOfWaiting(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("filter_by_minutes_of_waiting {MINUTES_OF_WAITING}");
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
            if (arguments.length < 2 || arguments[1].isEmpty()) throw new WrongAmountOfElementsException();

            var minutesOfWaiting = Integer.parseInt(arguments[1]);
            var response = (FilterByMinutesOfWaitingResponse) client.sendAndReceiveCommand(
                    new FilterByMinutesOfWaitingRequest(minutesOfWaiting)
            );

            if (response.getError() != null && !response.getError().isEmpty()) {
                throw new APIException(response.getError());
            }

            if (response.filteredHumanBeing.isEmpty()) {
                consoleFunctional.println("Людей с minutesOfWaiting = " + minutesOfWaiting + " не найдено.");
            } else {
                response.filteredHumanBeing.forEach(h ->
                        consoleFunctional.println(h.toString())
                );
            }
            return true;

        } catch (WrongAmountOfElementsException exception) {
            consoleFunctional.printError("Неправильное количество аргументов!");
            consoleFunctional.println("Использование: '" + getName() + "'");
        } catch(IOException e) {
            consoleFunctional.printError("Ошибка взаимодействия с сервером");
        } catch (NumberFormatException exception) {
            consoleFunctional.printError("Аргумент должен быть представлен числом!");
        } catch (APIException e) {
            consoleFunctional.printError(e.getMessage());
        }
        return false;
    }
}
