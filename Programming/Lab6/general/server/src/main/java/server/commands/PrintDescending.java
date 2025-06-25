package server.commands;



import server.controlCollection.HumanBeingRepository;
import transfer.base.HumanBeing;
import transfer.commands.requests.Request;
import transfer.commands.responses.PrintDescendingResponse;
import transfer.commands.responses.Response;
import java.util.*;


/**
 * Команда "print_ascending"
 * Выводит существа коллекции в порядке убывания
 */
public class PrintDescending extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public PrintDescending(HumanBeingRepository humanBeingRepository) {
        super("print_descending", "вывести элементы коллекции в порядке убывания");
        this.humanBeingRepository = humanBeingRepository;
    }
    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        try {
            List<HumanBeing> sorted = new ArrayList<>(humanBeingRepository.sorted());
            Collections.reverse(sorted);
            return new PrintDescendingResponse(sorted, null);
        } catch (Exception e) {
            return new PrintDescendingResponse(null, e.toString());
        }
    }
}