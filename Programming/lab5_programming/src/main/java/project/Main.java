package project;

import project.commands.*;
import project.managers.*;
import project.structure.InputManager;
import project.structure.Console;
import project.models.*;
import project.structure.Runner;
import project.managers.ConvertManager;
import java.util.Scanner;

/**
 * Класс для управления коллекции, инициализации системы, обработки команд и взаимодействия систем программы
 * @author nikolenko-maxim
 */
public class Main {
    public static void main(String[] args) {
        InputManager.setUserScanner(new Scanner(System.in));
        var console = new Console();

        String filePath = getFilePath(args, console);
        if (filePath == null || filePath.trim().isEmpty()) {
            console.printError("Не удалось определить путь к файлу данных");
            System.exit(1);
        }
        try {
            ConvertManager convertManager = new ConvertManager(filePath, console);
            CollectionManager collectionManager = new CollectionManager(convertManager);

            HumanBeing.updateNextId(collectionManager);


            var commandManager = new CommandManager() {{
                registerCommand("help", new Help(console, this));
                registerCommand("show", new Show(console, collectionManager));
                registerCommand("info", new Info(console, collectionManager));
                registerCommand("exit", new Exit(console));
                registerCommand("add", new Add(console, collectionManager));
                registerCommand("update_by_id", new UpdateId(console, collectionManager));
                registerCommand("remove_by_id", new RemoveById(console, collectionManager));
                registerCommand("clear", new Clear(console, collectionManager));
                registerCommand("save", new Save(console, collectionManager));
                registerCommand("execute_script", new ExecuteScript(console));
                registerCommand("sum_of_impact_speed", new SumOfImpactSpeed(console, collectionManager));
                 registerCommand("remove_by_soundtrack_name", new RemoveBySoundtrackName(console, collectionManager));
                 registerCommand("add_if_min", new AddIfMin(console, collectionManager));
                 registerCommand("filter_by_minutes_of_waiting", new FilterByMinutesOfWaiting(console, collectionManager));
                 registerCommand("print_ascending", new PrintAscending(console, collectionManager));
                 registerCommand("print_field_descending_impact_speed", new PrintFieldDescendingImpactSpeed(console, collectionManager));
            }};

            new Runner(console, commandManager).interactiveMode();
        } catch (Exception e) {
            console.printError("Фатальная ошибка инициализации: " + e.getMessage());
            System.exit(1);
        }
    }

    /**
     *
     * @param args Аргументы
     * @param console Консоль для вывода
     * @return Путь к данным или null
     */
    private static String getFilePath(String[] args, Console console) {

        String envPath = System.getenv("HUMAN_DATA_FILE");
        if (envPath != null && !envPath.trim().isEmpty()) {
            console.println("Используется файл из переменной окружения: " + envPath);
            return envPath;
        }

        return null;
    }
}
