package client.structure;

import client.App;
import client.commands.*;
import client.network.UDPClient;
import org.slf4j.Logger;
import client.commands.Command;
import transfer.commands.Commands;
import transfer.exceptions.ScriptRecursionException;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.*;

/**
 * Класс, запускающий введенные пользователем команды.
 */
public class Runner {
    private final ConsoleFunctional consoleFunctional;
    private final UDPClient client;
    private final Map<String, Command> commands;

    private final Logger logger = App.logger;
    private final List<String> scriptStack = new ArrayList<>();

    public Runner(UDPClient client, ConsoleFunctional consoleFunctional) {
        InputManager.setUserScanner(new Scanner(System.in));
        this.client = client;
        this.consoleFunctional = consoleFunctional;
        this.commands = new HashMap<>() {{
            put(Commands.HELP, new Help(consoleFunctional, client));
            put(Commands.INFO, new Info(consoleFunctional, client));
            put(Commands.SHOW, new Show(consoleFunctional, client));
            put(Commands.ADD, new Add(consoleFunctional, client));
            put(Commands.UPDATE_BY_ID, new UpdateId(consoleFunctional, client));
            put(Commands.REMOVE_BY_ID, new RemoveById(consoleFunctional, client));
            put(Commands.CLEAR, new Clear(consoleFunctional, client));
            put(Commands.REMOVE_BY_SOUNDTRACK_NAME, new RemoveBySoundtrackName(consoleFunctional, client));
            put(Commands.EXECUTE_SCRIPT, new ExecuteScript(consoleFunctional));
            put(Commands.EXIT, new Exit(consoleFunctional));
            put(Commands.PRINT_DESCENDING, new PrintDescending(consoleFunctional, client));
            put(Commands.ADD_IF_MIN, new AddIfMin(consoleFunctional, client));
            put(Commands.SUM_OF_IMPACT_SPEED, new SumOfImpactSpeed(consoleFunctional, client));
            put(Commands.FILTER_BY_MINUTES_OF_WAITING, new FilterByMinutesOfWaiting(consoleFunctional, client));
            put(Commands.PRINT_FIELD_DESCENDING_IMPACT_SPEED, new PrintFieldDescendingImpactSpeed(consoleFunctional, client));
        }};
    }

    /**
     * Интерактивный режим
     */
    public void interactiveMode() {
        var userScanner = InputManager.getUserScanner();
        try {
            ExitCode commandStatus;
            String[] userCommand = {"", ""};

            do {
                consoleFunctional.ps1();
                userCommand = (userScanner.nextLine().trim() + " ").split(" ", 2);
                userCommand[1] = userCommand[1].trim();
                commandStatus = launchCommand(userCommand);
            } while (commandStatus != ExitCode.EXIT);

        } catch (NoSuchElementException exception) {
            consoleFunctional.printError("Пользовательский ввод не обнаружен!");
        } catch (IllegalStateException exception) {
            consoleFunctional.printError("Непредвиденная ошибка!");
        }
    }

    /**
     * Режим для запуска скрипта.
     * @param argument Аргумент скрипта
     * @return Код завершения.
     */
    public ExitCode scriptMode(String argument) {
        String[] userCommand = {"", ""};
        ExitCode commandStatus;
        scriptStack.add(argument);
        if (!new File(argument).exists()) {
            argument = "../" + argument;
        }
        try (Scanner scriptScanner = new Scanner(new File(argument))) {
            if (!scriptScanner.hasNext()) throw new NoSuchElementException();
            Scanner tmpScanner = InputManager.getUserScanner();
            InputManager.setUserScanner(scriptScanner);
            InputManager.setFileMode();

            do {
                userCommand = (scriptScanner.nextLine().trim() + " ").split(" ", 2);
                userCommand[1] = userCommand[1].trim();
                while (scriptScanner.hasNextLine() && userCommand[0].isEmpty()) {
                    userCommand = (scriptScanner.nextLine().trim() + " ").split(" ", 2);
                    userCommand[1] = userCommand[1].trim();
                }
                consoleFunctional.println(consoleFunctional.getPS1() + String.join(" ", userCommand));
                if (userCommand[0].equals("execute_script")) {
                    for (String script : scriptStack) {
                        if (userCommand[1].equals(script)) throw new ScriptRecursionException();
                    }
                }
                commandStatus = launchCommand(userCommand);
            } while (commandStatus == ExitCode.OK && scriptScanner.hasNextLine());

            InputManager.setUserScanner(tmpScanner);
            InputManager.setUserMode();

            if (commandStatus == ExitCode.ERROR && !(userCommand[0].equals("execute_script") && !userCommand[1].isEmpty())) {
                consoleFunctional.println("Проверьте скрипт на корректность введенных данных!");
            }

            return commandStatus;

        } catch (FileNotFoundException exception) {
            consoleFunctional.printError("Файл со скриптом не найден!");
        } catch (NoSuchElementException exception) {
            consoleFunctional.printError("Файл со скриптом пуст!");
        } catch (ScriptRecursionException exception) {
            consoleFunctional.printError("Скрипты не могут вызываться рекурсивно!");
        } catch (IllegalStateException exception) {
            consoleFunctional.printError("Непредвиденная ошибка!");
            System.exit(0);
        } finally {
            scriptStack.remove(scriptStack.size() - 1);
        }
        return ExitCode.ERROR;
    }

    /**
     * Запускает команду.
     * @param userCommand Команда для запуска
     * @return Код завершения.
     */
    private ExitCode launchCommand(String[] userCommand) {
        if (userCommand[0].equals("")) return ExitCode.OK;
        var command = commands.get(userCommand[0]);

        if (command == null) {
            consoleFunctional.printError("Команда '" + userCommand[0] + "' не найдена. Наберите 'help' для справки");
            return ExitCode.ERROR;
        }
        switch (userCommand[0]) {
            case "exit" -> {
                if (!commands.get("exit").execute(userCommand)) return ExitCode.ERROR;
                else return ExitCode.EXIT;
            }
            case "execute_script" -> {
                if (!commands.get("execute_script").execute(userCommand)) return ExitCode.ERROR;
                else return scriptMode(userCommand[1]);
            }
            default -> {
                boolean result = command.execute(userCommand);
                if (!result) {
                    consoleFunctional.printError("Ошибка выполнения команды");
                    return ExitCode.ERROR;
                }
                return ExitCode.OK;
            }
        }
    }
}