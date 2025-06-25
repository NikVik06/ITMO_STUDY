package server.commands;
/**
 * Интерфейс для определения стандартных способов получения метаинформации об объектах
 */
public interface Describable {
    /**
     *
     * @return имя
     */
    String getName();

    /**
     *
     * @return описание
     */
    String getDescription();
}