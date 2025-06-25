package transfer.exceptions;

/**
 * Выбрасывается, если ошибка в серверных ответах
 */
public class APIException extends Exception {
    public APIException(String message) {
        super(message);
    }
}
