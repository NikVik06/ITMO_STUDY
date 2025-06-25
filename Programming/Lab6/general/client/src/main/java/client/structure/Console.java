package client.structure;

/**
 * Осушествляет вывод и ввод
 */
public class Console implements ConsoleFunctional {
    private String prompt1 = "> ";
    private String prompt2 = "... ";
    /**
     * Выводит объект без перевода строки
     *
     * @param obj объект для вывода
     */
    @Override
    public void print(Object obj) {
        System.out.print(obj);
    }
    /**
     * Выводит объект с перевода строки
     *
     * @param obj объект для вывода
     */
    @Override
    public void println(Object obj) {
        System.out.println(obj);
    }
    /**
     * Выводит сообщение об ошибке
     *
     * @param obj объект для вывода
     */
    @Override
    public void printError(Object obj) {
        System.err.println("Error: " + obj);
    }
    /**
     * Выводит описательное сообщение из двух частей.
     *
     * @param obj1 левый элемент
     * @param obj2 правый элемент
     */
    @Override
    public void printTableDescription(Object obj1, Object obj2) {
        System.out.printf(" %-35s%-1s%n", obj1, obj2);
    }
    /**
     * Выводит первичное приглашение командной строки (PS1)
     */
    @Override
    public void ps1() {
        print(prompt1);
    }
    /**
     * Выводит вторичное приглашение командной строки (PS2)
     */
    @Override
    public void ps2() {
        print(prompt2);
    }
    /**
     * @return PS1
     */
    @Override
    public String getPS1() {
        return prompt1;
    }
    /**
     * @return PS2
     */
    @Override
    public String getPS2() {
        return prompt2;
    }


}
