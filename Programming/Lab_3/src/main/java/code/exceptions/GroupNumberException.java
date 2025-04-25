package code.exceptions;

public class GroupNumberException extends RuntimeException {
    public GroupNumberException(String message) {
        super(message);
    }

    public String getMessage() {
        return "Ошибка количества: " + super.getMessage();
    }
}
