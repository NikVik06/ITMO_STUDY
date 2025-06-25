package server.commands;



import server.controlCollection.HumanBeingRepository;
import transfer.base.HumanBeing;
import transfer.commands.requests.RemoveBySoundtrackNameRequest;
import transfer.commands.requests.Request;
import transfer.commands.responses.RemoveBySoundtrackNameResponse;
import transfer.commands.responses.Response;
import java.util.List;
import java.util.stream.Collectors;
/**
 * Команда "remove_by_soundtrack_name {SOUNDTRACK_NAME}"
 * Удаляет из коллекции все элементы, значение поля soundTrackName которого эквивалентно заданному
 */
public class RemoveBySoundtrackName extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public RemoveBySoundtrackName(HumanBeingRepository humanBeingRepository) {
        super("remove_by_soundtrack_name {SOUNDTRACK_NAME}",
                " удалить из коллекции все элементы, значение поля soundTrackName которого эквивалентно заданному");
        this.humanBeingRepository = humanBeingRepository;
    }
    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        try {
            RemoveBySoundtrackNameRequest req = (RemoveBySoundtrackNameRequest) request;

            if (req.soundtrackName == null || req.soundtrackName.trim().isEmpty()) {
                return new RemoveBySoundtrackNameResponse(0, "Имя саундтрека не может быть пустым");
            }

            List<HumanBeing> toRemove = humanBeingRepository.get().stream()
                    .filter(h -> req.soundtrackName.equals(h.getSoundtrackName()))
                    .collect(Collectors.toList());

            toRemove.forEach(h -> humanBeingRepository.remove(h.getId()));

            return new RemoveBySoundtrackNameResponse(
                    toRemove.size(),
                    toRemove.isEmpty()
                            ? "Элементы с soundtrackName '" + req.soundtrackName + "' не найдены"
                            : null
            );

        } catch (Exception e) {
            return new RemoveBySoundtrackNameResponse(
                    0,
                    "Ошибка удаления: " + e.getMessage()
            );
        }
    }
}
