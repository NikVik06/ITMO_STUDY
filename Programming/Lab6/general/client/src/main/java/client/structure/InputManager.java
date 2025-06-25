package client.structure;

import java.util.Scanner;

/**
 * Управляет вводом данных с консоли или из файла.
 */
public class InputManager {
    private static Scanner userScanner;
    private static boolean  fileMode = false;

    public static Scanner getUserScanner() {
        return userScanner;
    }

    public static void setUserScanner(Scanner userScanner) {
        InputManager.userScanner = userScanner;
    }

    public static boolean fileMode() {
        return fileMode;
    }

    public static void setUserMode() {
        InputManager.fileMode = false;
    }

    public static void setFileMode() {
        InputManager.fileMode = true;
    }
}