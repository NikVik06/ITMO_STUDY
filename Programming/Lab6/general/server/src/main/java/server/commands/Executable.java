package server.commands;


import transfer.commands.requests.Request;
import transfer.commands.responses.Response;

/**
 * Интерфейс для всех выполняемых команд.
 */
public interface Executable {
    /**
     * Выполнить что-либо.
     *
     * @param request Аргумент для выполнения
     * @return результат выполнения
     */
    Response execute(Request request);
}