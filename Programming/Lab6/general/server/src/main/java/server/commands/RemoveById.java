package server.commands;


import server.controlCollection.HumanBeingRepository;
import transfer.commands.requests.RemoveByIdRequest;
import transfer.commands.requests.Request;
import transfer.commands.responses.RemoveByIdResponse;
import transfer.commands.responses.Response;

/**
 * Команда "remove_by_id {ID}"
 * Удаляет элемент из коллекции по ID
 */
public class RemoveById extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public RemoveById(HumanBeingRepository humanBeingRepository) {
        super("remove_by_id {ID}", "удалить элемент из коллекции по ID");
        this.humanBeingRepository = humanBeingRepository;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        RemoveByIdRequest req = (RemoveByIdRequest) request;

        try {
            if (!humanBeingRepository.checkExist(req.id)) {
                return new RemoveByIdResponse(false,"Существа с таким ID в коллекции нет!");
            }

            humanBeingRepository.remove(req.id);
            return new RemoveByIdResponse(true,null);
        } catch (Exception e) {
            return new RemoveByIdResponse(false,e.toString());
        }
    }
}