package project.models.creater;

import project.exceptions.IncorrectInputInScriptException;
import project.exceptions.InvalidCreaterException;

/**
 * Абстрактный класс структуры для ввода данных
 * @param <T> создаваемый объект
 */
public abstract class Creater<T> {
    /**
     * Метод для создания объектов типа T.
     * Реализация должна запрашивать у пользователя необходимые данные
     * и создавать соответствующий объект.
     * @throws IncorrectInputInScriptException если возникает ошибка ввода при выполнении скрипта
     * @throws InvalidCreaterException если введенные данные не прошли валидацию
     */
    public abstract T create() throws IncorrectInputInScriptException, InvalidCreaterException;
}
