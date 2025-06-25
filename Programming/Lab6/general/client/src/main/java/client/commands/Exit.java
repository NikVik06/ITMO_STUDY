package client.commands;


import client.structure.ConsoleFunctional;

/**
 * Команда "exit"
 * Завершает выполнение
 */
public class Exit extends Command {
    private final ConsoleFunctional consoleFunctional;

    public Exit(ConsoleFunctional consoleFunctional) {
        super("exit");
        this.consoleFunctional = consoleFunctional;
    }

    /**
     * Выполняет команду
     * @return Результат выполнения команды.
     */
    @Override
    public boolean execute(String[] arguments) {
        if (!arguments[1].isEmpty()) {
            consoleFunctional.println("Использование: '" + getName() + "'");
            return false;
        }

        consoleFunctional.println("Завершение выполнения...");
        return true;
    }
}
