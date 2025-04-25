package project.structure;

/**
 * Статусы выполнения команд
 */
public enum ExitCode {
    OK,     // Команда выполнена успешно
    ERROR,  // Произошла ошибка при выполнении
    EXIT    // Требуется завершить программу
}