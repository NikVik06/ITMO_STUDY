package project.commands;

import project.managers.CommandManager;
import project.structure.Console;

/**
 * Команда "help"
 * Выводит справку по доступным командам
 */
public class Help extends Command {
    private final Console console;
    private final CommandManager commandManager;

    public Help(Console console, CommandManager commandManager) {
        super("help", "вывести справку по доступным командам");
        this.console = console;
        this.commandManager = commandManager;
    }

    /**
     * Выполняет команду
     * @return результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments) {
        if (!arguments[1].isEmpty()) {
            console.println("Использование: '" + getName() + "'");
            return false;
        }

        commandManager.getCommand().values().forEach(command -> {
            console.printTableDescription(command.getName(), command.getDescription());
        });
        return true;
    }
}