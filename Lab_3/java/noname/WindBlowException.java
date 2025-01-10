package noname;


class WindBlowException extends RuntimeException {
    public WindBlowException(String message) {
        super(message);
    }
    @Override
    public String getMessage(){
        return "Ошибка ветра: " + super.getMessage();
    }
}
