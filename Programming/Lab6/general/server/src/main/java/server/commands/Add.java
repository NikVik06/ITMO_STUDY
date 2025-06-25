package server.commands;



import server.controlCollection.HumanBeingRepository;
import transfer.commands.requests.AddRequest;
import transfer.commands.requests.Request;
import transfer.commands.responses.AddResponse;
import transfer.commands.responses.Response;


/**
 * Команда 'add'. Добавляет новый элемент в коллекцию.
 */
public class Add extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public Add(HumanBeingRepository humanBeingRepository) {
        super("add", "добавить новый элемент в коллекцию");
        this.humanBeingRepository = humanBeingRepository;
    }

    /**
     * Выполняет команду
     * @return Успешность выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        var req = (AddRequest) request;
        try {
            if (!req.humanBeing.validate()) {
                return new AddResponse(-1, "Поля существа не валидны! Существо не добавлено!");
            }
            var newId = humanBeingRepository.add(req.humanBeing);
            return new AddResponse(newId, null);
        } catch (Exception e) {
            return new AddResponse(-1, e.toString());
        }
    }
}
