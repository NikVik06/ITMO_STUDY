package client.commands;


import java.util.Objects;

/** Абстрактный базовый класс для всех команд приложения
 * Реализует шаблон для реализации команд.
 */
public abstract class Command {
    private final String name;

    public Command(String name) {
        this.name = name;
    }

    public boolean resolve(String name) {
        return name.equals(this.name);
    }
    public String getName(){
        return name;
    }


    public abstract boolean execute(String[] arguments);

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Command command = (Command) o;
        return Objects.equals(name, command.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "Command{" +
                "name='" + name + '\'' +
                '}';
    }
}
