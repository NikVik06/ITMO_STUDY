package project.commands;


import java.util.Objects;

/** Абстрактный базовый класс для всех команд приложения
 * Реализует основные свойства и поведение команд, оставляя реализацию выполнения конкретных команд наследникам
 *
 */
public abstract class Command implements  Describable, Executable {
    private final String name;
    private final String description;

    public Command(String name,String description) {
        this.name = name;
        this.description = description;
    }

    @Override
    public String getName(){
        return name;
    }

    @Override
    public String getDescription(){
        return description;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Command command = (Command) o;
        return Objects.equals(name, command.name) && Objects.equals(description, command.description);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name, description);
    }

    @Override
    public String toString() {
        return "Command{" +
                "name='" + name + '\'' +
                ", description='" + description + '\'' +
                '}';
    }
}
