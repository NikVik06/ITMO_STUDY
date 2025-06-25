package server.network;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import server.CommandHandler;


import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.net.InetAddress;
import java.net.InetSocketAddress;
import java.net.SocketAddress;
import java.nio.ByteBuffer;
import java.nio.channels.DatagramChannel;
import java.util.Arrays;

public class UDPChannelServer extends UDPServer {
    private static final Logger logger = LoggerFactory.getLogger(UDPChannelServer.class);
    private static final int PACKET_SIZE = 1024;
    private static final int DATA_SIZE = PACKET_SIZE - 1;
    private static final int RECEIVE_TIMEOUT_MS = 5000;

    private final DatagramChannel channel;

    public UDPChannelServer(InetAddress address, int port, CommandHandler commandHandler) throws IOException {
        super(new InetSocketAddress(address, port), commandHandler);
        this.channel = DatagramChannel.open();
        this.channel.bind(getAddr());
        this.channel.configureBlocking(false);
        logger.info("Сервер запущен на {}:{}", address, port);
    }

    @Override
    public ByteArrayWithAddress receiveData() throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        SocketAddress clientAddress = null;
        boolean isComplete = false;
        long startTime = System.currentTimeMillis();

        while (!isComplete && (System.currentTimeMillis() - startTime < RECEIVE_TIMEOUT_MS)) {
            ByteBuffer buffer = ByteBuffer.allocate(PACKET_SIZE);
            SocketAddress sender = channel.receive(buffer);

            if (sender != null) {
                clientAddress = sender;
                buffer.flip();
                byte[] packetData = new byte[buffer.remaining()];
                buffer.get(packetData);

                if (packetData.length > 0) {
                    isComplete = (packetData[packetData.length - 1] == 1);
                    baos.write(packetData, 0, packetData.length - 1);
                }
            } else {
                try {
                    Thread.sleep(100);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                    throw new IOException("Поток прерван", e);
                }
            }
        }

        if (!isComplete) {
            throw new IOException("Таймаут приема данных: не получен флаг окончания");
        }

        byte[] primitiveResult = baos.toByteArray();
        // Конвертируем byte[] в Byte[]
        Byte[] boxedResult = new Byte[primitiveResult.length];
        for (int i = 0; i < primitiveResult.length; i++) {
            boxedResult[i] = primitiveResult[i];
        }

        return new ByteArrayWithAddress(boxedResult, clientAddress);
    }

    @Override
    public void sendData(byte[] data, SocketAddress addr) throws IOException {
        int totalChunks = (int) Math.ceil(data.length / (double) DATA_SIZE);
        logger.debug("Отправка {} чанков ({} байт) клиенту {}", totalChunks, data.length, addr);

        for (int i = 0; i < totalChunks; i++) {
            int start = i * DATA_SIZE;
            int end = Math.min(start + DATA_SIZE, data.length);
            byte[] chunk = Arrays.copyOfRange(data, start, end);

            byte[] packet = new byte[chunk.length + 1];
            System.arraycopy(chunk, 0, packet, 0, chunk.length);
            packet[packet.length - 1] = (i == totalChunks - 1) ? (byte) 1 : (byte) 0;

            ByteBuffer buffer = ByteBuffer.wrap(packet);
            channel.send(buffer, addr);
        }
    }

    @Override
    public void connectToClient(SocketAddress addr) throws IOException {
        channel.connect(addr);
        logger.info("Установлено соединение с клиентом {}", addr);
    }

    @Override
    public void disconnectFromClient() {
        try {
            if (channel.isConnected()) {
                channel.disconnect();
                logger.info("Соединение с клиентом разорвано");
            }
        } catch (IOException e) {
            logger.error("Ошибка при разрыве соединения", e);
        }
    }

    @Override
    public void close() {
        try {
            if (channel.isOpen()) {
                channel.close();
                logger.info("Канал закрыт");
            }
        } catch (IOException e) {
            logger.error("Ошибка при закрытии канала", e);
        }
    }

    private byte[] concatArrays(byte[] first, byte[] second) {
        byte[] result = Arrays.copyOf(first, first.length + second.length);
        System.arraycopy(second, 0, result, first.length, second.length);
        return result;
    }
}