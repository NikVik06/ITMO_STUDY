package server.network;




import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import server.CommandHandler;
import transfer.commands.requests.Request;
import transfer.commands.responses.NoSuchCommandResponse;
import transfer.commands.responses.Response;


import java.io.*;
import java.net.InetSocketAddress;
import java.net.SocketAddress;

/**
 * UDP обработчик запросов
 */
abstract class UDPServer {
    private final InetSocketAddress addr;
    private final CommandHandler commandHandler;
    private Runnable afterHook;
    private boolean running = true;

    private static final Logger logger = LoggerFactory.getLogger(UDPServer.class);

    public UDPServer(InetSocketAddress addr, CommandHandler commandHandler) {
        this.addr = addr;
        this.commandHandler = commandHandler;
    }

    public InetSocketAddress getAddr() {
        return addr;
    }


    public abstract ByteArrayWithAddress receiveData() throws IOException;


    public abstract void sendData(byte[] data, SocketAddress addr) throws IOException;

    public abstract void connectToClient(SocketAddress addr) throws IOException;

    public abstract void disconnectFromClient();

    public abstract void close();

    protected static class ByteArrayWithAddress {
        private final Byte[] data;
        private final SocketAddress address;

        public ByteArrayWithAddress(Byte[] data, SocketAddress address) {
            this.data = data;
            this.address = address;
        }

        public Byte[] getData() {
            return data;
        }

        public SocketAddress getAddress() {
            return address;
        }
    }

    public void run() {
        logger.info("Сервер запущен по адресу {}", addr);

        while (running) {
            ByteArrayWithAddress receivedData;
            try {
                receivedData = receiveData();
            } catch (Exception e) {
                logger.error("Ошибка получения данных", e);
                disconnectFromClient();
                continue;
            }

            Byte[] dataFromClient = receivedData.getData();
            SocketAddress clientAddr = receivedData.getAddress();

            try {
                connectToClient(clientAddr);
                logger.info("Соединено с {}", clientAddr);
                byte[] primitiveData = new byte[dataFromClient.length];
                for (int i = 0; i < dataFromClient.length; i++) {
                    primitiveData[i] = dataFromClient[i];
                }
                Request request;
                try (ByteArrayInputStream bis = new ByteArrayInputStream(primitiveData);
                     ObjectInputStream ois = new ObjectInputStream(bis)) {
                    request = (Request) ois.readObject();
                    logger.info("Обработка {} из {}", request, clientAddr);
                } catch (Exception e) {
                    logger.error("Невозможно десериализовать объект запроса", e);
                    disconnectFromClient();
                    continue;
                }

                Response response;
                try {
                    response = commandHandler.handle(request);
                    if (afterHook != null) {
                        afterHook.run();
                    }
                } catch (Exception e) {
                    logger.error("updserver", e);
                    response = new NoSuchCommandResponse(request.getName());
                }

                logger.info("Ответ: {}", response);

                byte[] responseData;
                try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
                     ObjectOutputStream oos = new ObjectOutputStream(bos)) {
                    oos.writeObject(response);
                    responseData = bos.toByteArray();
                }

                try {
                    sendData(responseData, clientAddr);
                    logger.info("Отправлен ответ клиенту {}", clientAddr);
                } catch (Exception e) {
                    logger.error("Ошибка ввода-вывода при отправке ответа", e);
                }

            } catch (Exception e) {
                logger.error("Ошибка обработки запроса", e);
            } finally {
                disconnectFromClient();
                logger.info("Отключение от клиента {}", clientAddr);
            }
        }

        close();
    }

    public void setAfterHook(Runnable afterHook) {
        this.afterHook = afterHook;
    }

    public void stop() {
        running = false;
    }
}