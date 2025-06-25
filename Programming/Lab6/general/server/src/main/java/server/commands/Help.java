package server.commands;



import server.managers.CommandManager;
import transfer.commands.requests.Request;
import transfer.commands.responses.HelpResponse;
import transfer.commands.responses.Response;


/**
 * Команда "help"
 * Выводит справку по доступным командам
 */
public class Help extends Command {
    private final CommandManager commandManager;

    public Help(CommandManager commandManager) {
        super("help", "вывести справку по доступным командам");
        this.commandManager = commandManager;
    }

    /**
     * Выполняет команду
     * @return результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        var helpMessage = new StringBuilder();

        commandManager.getCommand().values().forEach(command -> {
            helpMessage.append(" %-35s%-1s%n".formatted(command.getName(), command.getDescription()));
        });

        return new HelpResponse(helpMessage.toString(), null);
    }
}