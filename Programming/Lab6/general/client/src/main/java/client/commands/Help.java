package client.commands;

import client.network.UDPClient;
import client.structure.ConsoleFunctional;
import transfer.commands.requests.HelpRequest;
import transfer.commands.responses.HelpResponse;

import java.io.IOException;


/**
 * Команда "help"
 * Выводит справку по доступным командам
 */
public class Help extends Command {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;

    public Help(ConsoleFunctional consoleFunctional, UDPClient client) {
        super("help");
        this.consoleFunctional = consoleFunctional;
        this.client = client;
    }

    /**
     * Выполняет команду
     * @return результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments) {
        if (!arguments[1].isEmpty()) {
            consoleFunctional.println("Использование: '" + getName() + "'");
            consoleFunctional.printError("Неправильное количество аргументов!");
            return false;
        }

        try {
            var response = (HelpResponse) client.sendAndReceiveCommand(new HelpRequest());
            consoleFunctional.print(response.helpMessage);
            return true;
        } catch(IOException e) {
            consoleFunctional.printError("Ошибка взаимодействия с сервером");
        }
        return false;
    }
}