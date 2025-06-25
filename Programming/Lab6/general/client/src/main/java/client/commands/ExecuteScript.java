package client.commands;


import client.structure.ConsoleFunctional;

/**
 * Команда "execute_script"
 * Выполнить скрипт из файла
 */
public class ExecuteScript extends Command {
    private final ConsoleFunctional consoleFunctional;

    public ExecuteScript(ConsoleFunctional consoleFunctional) {
        super("execute_script {file_name}");

        this.consoleFunctional = consoleFunctional;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments) {
        if (arguments[1].isEmpty()) {
            consoleFunctional.println("Использование: '" + getName() + "'");
            return false;
        }

        consoleFunctional.println("Выполнение скрипта '" + arguments[1] + "'...");
        return true;
    }
}
