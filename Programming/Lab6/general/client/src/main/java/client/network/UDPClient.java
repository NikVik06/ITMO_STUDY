package client.network;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import transfer.commands.requests.Request;
import transfer.commands.responses.Response;

import java.io.*;
import java.net.*;
import java.util.Arrays;

public class UDPClient {
    private static final Logger logger = LoggerFactory.getLogger(UDPClient.class);
    private static final int PACKET_SIZE = 1024;
    private static final int DATA_SIZE = PACKET_SIZE - 1;
    private static final int TIMEOUT_MS = 2000;
    private static final int MAX_ATTEMPTS = 3;

    private final DatagramSocket socket;
    private final InetSocketAddress serverAddress;

    public UDPClient(InetAddress address, int port) throws SocketException {
        this.serverAddress = new InetSocketAddress(address, port);
        this.socket = new DatagramSocket();
        this.socket.setSoTimeout(TIMEOUT_MS);
        logger.info("Инициализирован UDP клиент для {}:{}", address.getHostAddress(), port);
    }

    public Response sendAndReceiveCommand(Request request) throws IOException {
        int attempts = 0;
        IOException lastException = null;

        while (attempts < MAX_ATTEMPTS) {
            attempts++;
            try {
                byte[] requestData = serialize(request);
                byte[] responseData = sendAndReceiveData(requestData);
                return deserialize(responseData);
            } catch (SocketTimeoutException e) {
                logger.warn("Таймаут приема данных (попытка {}/{})", attempts, MAX_ATTEMPTS);
                lastException = e;
            } catch (ClassNotFoundException e) {
                logger.error("Ошибка десериализации ответа", e);
                throw new IOException("Invalid response format", e);
            } catch (IOException e) {
                logger.error("Ошибка ввода-вывода (попытка {}/{})", attempts, MAX_ATTEMPTS, e);
                lastException = e;
            }
        }

        throw new IOException("Не удалось получить ответ после " + MAX_ATTEMPTS + " попыток", lastException);
    }
    private byte[] serialize(Serializable obj) throws IOException {
        try (ByteArrayOutputStream bos = new ByteArrayOutputStream();
             ObjectOutputStream oos = new ObjectOutputStream(bos)) {
            oos.writeObject(obj);
            return bos.toByteArray();
        }
    }
    private Response deserialize(byte[] data) throws IOException, ClassNotFoundException {
        try (ByteArrayInputStream bis = new ByteArrayInputStream(data);
             ObjectInputStream ois = new ObjectInputStream(bis)) {
            return (Response) ois.readObject();
        }
    }

    private byte[] sendAndReceiveData(byte[] data) throws IOException {
        sendData(data);
        return receiveData();
    }

    private void sendData(byte[] data) throws IOException {
        int totalChunks = (int) Math.ceil(data.length / (double) DATA_SIZE);
        logger.debug("Отправка {} чанков (общий размер: {} байт)", totalChunks, data.length);

        for (int i = 0; i < totalChunks; i++) {
            int start = i * DATA_SIZE;
            int end = Math.min(start + DATA_SIZE, data.length);
            byte[] chunk = Arrays.copyOfRange(data, start, end);

            byte[] packet = new byte[chunk.length + 1];
            System.arraycopy(chunk, 0, packet, 0, chunk.length);
            packet[packet.length - 1] = (i == totalChunks - 1) ? (byte) 1 : (byte) 0;

            DatagramPacket dp = new DatagramPacket(packet, packet.length, serverAddress);
            socket.send(dp);
            logger.trace("Отправлен чанк {}/{} ({} байт)", i + 1, totalChunks, chunk.length);
        }
    }

    private byte[] receiveData() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        boolean isComplete = false;
        int packetCount = 0;

        while (!isComplete) {
            byte[] buffer = new byte[PACKET_SIZE];
            DatagramPacket dp = new DatagramPacket(buffer, buffer.length);

            socket.receive(dp);
            packetCount++;

            int receivedLength = dp.getLength();
            isComplete = (buffer[receivedLength - 1] == 1);

            baos.write(buffer, 0, receivedLength - 1);
            logger.trace("Получен пакет {} ({} байт)", packetCount, receivedLength);
        }

        logger.info("Получено {} пакетов, всего {} байт", packetCount, baos.size());
        return baos.toByteArray();
    }

    public void close() {
        if (socket != null && !socket.isClosed()) {
            socket.close();
            logger.debug("Сокет клиента закрыт");
        }
    }
}