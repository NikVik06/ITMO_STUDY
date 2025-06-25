package client.structure;
/**
 * Консольные приглашения и методы вывода результата
 */
public interface ConsoleFunctional {
    void print(Object obj);
    void println(Object obj);
    void printError(Object  obj);
    void printTableDescription(Object  obj1,Object  obj2);
    void ps1();
    void ps2();
    String getPS1();
    String getPS2();


}
