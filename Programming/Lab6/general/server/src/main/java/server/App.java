package server;


import client.structure.Console;
import client.structure.ConsoleFunctional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import server.commands.*;
import server.controlCollection.HumanBeingRepository;
import server.managers.CommandManager;
import server.managers.ConvertManager;
import server.network.UDPChannelServer;
import transfer.commands.Commands;
import java.io.IOException;
import java.net.InetAddress;
import java.net.SocketException;
import java.net.UnknownHostException;



public class App {
    public static final int PORT = 23586;

    public static Logger logger = LoggerFactory.getLogger("ServerLogger");
    private static final String ENV_VAR_NAME = "HUMAN_DATA_FILE";
    public static void main(String[] args) {
        ConsoleFunctional consoleFunctional = new Console();
        String filePath = System.getenv(ENV_VAR_NAME);

        if (filePath == null || filePath.isBlank()) {
            logger.error("Переменная окружения {} не установлена!", ENV_VAR_NAME);
            System.exit(1);
            return;
        }

        var convertManager = new ConvertManager(filePath,consoleFunctional);
        var repository = new HumanBeingRepository(convertManager);
        if(!repository.validateAll()) {
            logger.error("Невалидные продукты в загруженном файле!");
            System.exit(2);
        }

        Runtime.getRuntime().addShutdownHook(new Thread(repository::save));

        var commandManager = new CommandManager() {{
            registerCommand(Commands.HELP, new Help(this));
            registerCommand(Commands.INFO, new Info(repository));
            registerCommand(Commands.SHOW, new Show(repository));
            registerCommand(Commands.ADD, new Add(repository));
            registerCommand(Commands.UPDATE_BY_ID, new UpdateId(repository));
            registerCommand(Commands.REMOVE_BY_ID, new RemoveById(repository));
            registerCommand(Commands.CLEAR, new Clear(repository));
            registerCommand(Commands.REMOVE_BY_SOUNDTRACK_NAME, new RemoveBySoundtrackName(repository));
            registerCommand(Commands.PRINT_DESCENDING, new PrintDescending(repository));
            registerCommand(Commands.ADD_IF_MIN, new AddIfMin(repository));
            registerCommand(Commands.SUM_OF_IMPACT_SPEED, new SumOfImpactSpeed(repository));
            registerCommand(Commands.FILTER_BY_MINUTES_OF_WAITING, new FilterByMinutesOfWaiting(repository));
            registerCommand(Commands.PRINT_FIELD_DESCENDING_IMPACT_SPEED, new PrintFieldDescendingImpactSpeed(repository));
        }};
        try {
            var server = new UDPChannelServer(InetAddress.getLocalHost(), PORT, new CommandHandler(commandManager));
            server.setAfterHook(repository::save);
            server.run();
        } catch (SocketException e) {
            logger.error("Случилась ошибка сокета", e);
            System.exit(1);
        } catch (UnknownHostException e) {
            logger.error("Неизвестный хост", e);
            System.exit(1);
        } catch (IOException e) {  // Добавьте эту обработку
            logger.error("Ошибка ввода-вывода", e);
            System.exit(1);
        }
    }
}

