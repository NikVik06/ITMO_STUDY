package client.commands;



import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.InfoRequest;
import transfer.commands.responses.InfoResponse;
import java.io.IOException;

/**
 * Команда "info"
 * Выводит информацию о коллекции
 */
public class Info extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public Info(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("info");
        this.consoleFunctional = consoleFunctional;
        this.client = client;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments) {
        if (!arguments[1].isEmpty()) {
            consoleFunctional.printError("Неправильное количество аргументов!");
            consoleFunctional.println("Использование: '" + getName() + "'");
            return false;
        }

        try {
            var response = (InfoResponse) client.sendAndReceiveCommand(new InfoRequest());
            consoleFunctional.println(response.infoMessage);
            return true;
        } catch(IOException e) {
            consoleFunctional.printError("Ошибка взаимодействия с сервером");
        }
        return false;
    }
}