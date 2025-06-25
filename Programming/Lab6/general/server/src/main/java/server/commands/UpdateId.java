package server.commands;


import server.controlCollection.HumanBeingRepository;
import transfer.commands.requests.Request;
import transfer.commands.requests.UpdateRequest;
import transfer.commands.responses.Response;
import transfer.commands.responses.UpdateResponse;

/**
 * Команда "update_by_id {element}"
 * Обновляет значение элемента коллекции по ID
 */
public class UpdateId extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public UpdateId(HumanBeingRepository humanBeingRepository) {
        super("update_by_id {element}", "обновить значение элемента коллекции по ID");
        this.humanBeingRepository = humanBeingRepository;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        var req = (UpdateRequest) request;
        try {
            if (!humanBeingRepository.checkExist(req.id)) {
                return new UpdateResponse("Существа с таким ID в коллекции нет!");
            }
            if (!req.updatedHumanBeing.validate()) {
                return new UpdateResponse("Поля существа не валидны! Существо не обновлено!");
            }

            humanBeingRepository.getById(req.id).update(req.updatedHumanBeing);
            return new UpdateResponse(null);
        } catch (Exception e) {
            return new UpdateResponse(e.toString());
        }
    }
}
