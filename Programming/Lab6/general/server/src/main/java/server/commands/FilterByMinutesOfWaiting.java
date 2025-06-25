package server.commands;

import server.controlCollection.HumanBeingRepository;
import transfer.base.HumanBeing;
import transfer.commands.requests.FilterByMinutesOfWaitingRequest;
import transfer.commands.requests.Request;
import transfer.commands.responses.FilterByMinutesOfWaitingResponse;
import transfer.commands.responses.Response;
import transfer.structure.HumanBeingComparator;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Команда "filter_by_minutes_of_waiting"
 * Сортировка существ по минутам
 */
public class FilterByMinutesOfWaiting extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public FilterByMinutesOfWaiting(HumanBeingRepository humanBeingRepository) {
        super("filter_by_minutes_of_waiting {MINUTES_OF_WAITING}", "вывести элементы, значение поля minutesOfWaiting которых равно заданному");
        this.humanBeingRepository = humanBeingRepository;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        var req = (FilterByMinutesOfWaitingRequest) request;
        try {
            return new FilterByMinutesOfWaitingResponse(filterByMinutesOfWaiting(req.minutesOfWaiting), null);
        } catch (Exception e) {
            return new FilterByMinutesOfWaitingResponse(null, e.toString());
        }
    }

    private List<HumanBeing> filterByMinutesOfWaiting(int minutes) {
        return humanBeingRepository.get().stream()
                .filter(h -> h.getMinutesOfWaiting() == minutes)
                .sorted(new HumanBeingComparator())
                .collect(Collectors.toList());
    }
}
