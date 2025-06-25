package client;

import client.structure.Console;
import client.structure.Runner;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import client.network.UDPClient;

import java.io.IOException;
import java.net.InetAddress;

/**
 * Класс, запускающий работу клиентского модуля
 */
public class App {
    private static final int PORT = 23586;
    public static final Logger logger = LoggerFactory.getLogger("ClientLogger");

    public static void main(String[] args) {
        var console = new Console();
        try {
            var client = new UDPClient(InetAddress.getLocalHost(), PORT);
            var cli = new Runner(client, console);

            cli.interactiveMode();
        } catch (IOException e) {
            logger.info("Невозможно подключиться к серверу.", e);
            System.out.println("Невозможно подключиться к серверу!");
        }
    }
}