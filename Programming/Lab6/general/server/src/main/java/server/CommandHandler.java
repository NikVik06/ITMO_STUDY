package server;


import server.managers.CommandManager;
import transfer.commands.requests.Request;
import transfer.commands.responses.NoSuchCommandResponse;
import transfer.commands.responses.Response;

public class CommandHandler {
    private final CommandManager manager;

    public CommandHandler(CommandManager manager) {
        this.manager = manager;
    }

    public Response handle(Request request) {
        var command = manager.getCommand().get(request.getName());
        if (command == null) return new NoSuchCommandResponse(request.getName());
        return command.execute(request);
    }
}