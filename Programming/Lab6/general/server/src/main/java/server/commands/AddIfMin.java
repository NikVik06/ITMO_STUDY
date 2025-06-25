package server.commands;


import server.controlCollection.HumanBeingRepository;
import transfer.base.HumanBeing;
import transfer.commands.requests.AddIfMinRequest;
import transfer.commands.requests.Request;
import transfer.commands.responses.AddIfMinResponse;
import transfer.commands.responses.Response;

/**
 * Команда "add_if_min"
 * Добавляет новое существо в коллекцию, если его скорость меньше минимальной.
 */
public class AddIfMin extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public AddIfMin(HumanBeingRepository humanBeingRepository) {
        super("add_if_min {element}", "добавить новый элемент в коллекцию, если его скорость удара меньше минимальной цены этой коллекции");
        this.humanBeingRepository = humanBeingRepository;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        try {
            var req = (AddIfMinRequest) request;
            var minImpactSpeed = minImpactSpeed();
            if (req.humanBeing.getImpactSpeed() < minImpactSpeed) {
                var newId = humanBeingRepository.add(req.humanBeing);
                return new AddIfMinResponse(true, newId, null);
            }
            return new AddIfMinResponse(false, -1, null);
        } catch (Exception e) {
            return new AddIfMinResponse(false, -1, e.toString());
        }
    }

    private double minImpactSpeed() {
        return humanBeingRepository.get().stream()
                .map(HumanBeing::getImpactSpeed)
                .mapToDouble(Double::doubleValue)
                .min()
                .orElse(Double.MAX_VALUE);
    }
}