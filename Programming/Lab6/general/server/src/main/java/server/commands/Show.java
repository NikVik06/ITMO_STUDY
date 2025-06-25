package server.commands;


import server.controlCollection.HumanBeingRepository;
import transfer.commands.requests.Request;
import transfer.commands.responses.Response;
import transfer.commands.responses.ShowResponse;

/**
 * Команда "show"
 * Выводит все элементы коллекции
 */
public class Show extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public Show(HumanBeingRepository humanBeingRepository) {
        super("show", "вывести все элементы коллекции");
        this.humanBeingRepository = humanBeingRepository;
    }

    /**
     * Выполняет команду
     * @return результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        try {
            return new ShowResponse(humanBeingRepository.sorted(), null);
        } catch (Exception e) {
            return new ShowResponse(null, e.toString());
        }
    }
}
