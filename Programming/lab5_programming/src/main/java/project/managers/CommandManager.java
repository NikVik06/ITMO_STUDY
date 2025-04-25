package project.managers;

import project.commands.Command;
import project.structure.ExitCode;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
/**
 * Менеджер для регистрации и управления командами.
 */
public class CommandManager {
    private final Map<String, Command> commands = new HashMap<>();
    private final List<String> commandHistory = new ArrayList<>();

    /**
     * Регистрирует новую команду
     *
     * @param commandName    Название команды
     * @param command Объект команды
     *
     */
    public void registerCommand(String commandName, Command command) {
        commands.put(commandName.toLowerCase(), command);
    }

    /**
     * Получает команду по названию
     * @return Объект команды или null если не найдена
     */
    public Map<String, Command> getCommand() {
        return commands;
    }

    /**
     * @return История команд
     */
    public List<String> getCommandHistory() {
        return commandHistory;
    }

    /**
     * Добавляет команду в историю
     * @param command Команда
     */
    public void addToHistory(String command) {
        commandHistory.add(command);
    }
}
