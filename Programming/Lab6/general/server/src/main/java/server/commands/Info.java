package server.commands;



import server.controlCollection.HumanBeingRepository;
import transfer.commands.requests.Request;
import transfer.commands.responses.InfoResponse;
import transfer.commands.responses.Response;

/**
 * Команда "info"
 * Выводит информацию о коллекции
 */
public class Info extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public Info(HumanBeingRepository humanBeingRepository) {
        super("info", "вывести информацию о коллекции");
        this.humanBeingRepository = humanBeingRepository;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public Response execute(Request request) {
        var lastInitTime = humanBeingRepository.getLastInitTime();
        var lastInitTimeString = (lastInitTime == null) ? "в данной сессии инициализации еще не происходило" :
                lastInitTime.toLocalDate().toString() + " " + lastInitTime.toLocalTime().toString();

        var lastSaveTime = humanBeingRepository.getLastSaveTime();
        var lastSaveTimeString = (lastSaveTime == null) ? "в данной сессии сохранения еще не происходило" :
                lastSaveTime.toLocalDate().toString() + " " + lastSaveTime.toLocalTime().toString();

        var message = "Сведения о коллекции:\n" +
                " Тип: " + humanBeingRepository.type() + "\n" +
                " Количество элементов: " + humanBeingRepository.size() + "\n" +
                " Дата последнего сохранения: " + lastSaveTimeString + "\n" +
                " Дата последней инициализации: " + lastInitTimeString;
        return new InfoResponse(message, null);
    }
}