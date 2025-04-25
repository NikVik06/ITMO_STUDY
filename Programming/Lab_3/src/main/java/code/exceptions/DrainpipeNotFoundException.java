package code.exceptions;


public class DrainpipeNotFoundException extends Exception {
    public DrainpipeNotFoundException(String message) {
        super(message);
    }

    @Override
    public String getMessage() {
        return "Ошибка восхождения: " + super.getMessage();
    }
}