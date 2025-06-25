package server.commands;


import server.controlCollection.HumanBeingRepository;
import transfer.commands.requests.Request;
import transfer.commands.responses.ClearResponse;
import transfer.commands.responses.Response;

/**
 * Команда "clear"
 * Очищает коллекцию
 */
public class Clear extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public Clear(HumanBeingRepository humanBeingRepository) {
        super("clear", "очистить коллекцию");
        this.humanBeingRepository = humanBeingRepository;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        try {
            humanBeingRepository.clear();
            return new ClearResponse(null);
        } catch (Exception e) {
            return new ClearResponse(e.toString());
        }
    }

}
