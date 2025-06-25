package server.managers;

import com.opencsv.bean.*;
import com.opencsv.exceptions.CsvDataTypeMismatchException;
import com.opencsv.exceptions.CsvRequiredFieldEmptyException;
import client.structure.ConsoleFunctional;
import server.converters.CoordinatesConverter;
import server.converters.ZonedDateTimeConverter;
import transfer.base.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.ZonedDateTime;
import java.util.*;

/**
 * Управляет преобразованием между коллекциями объектов и csv-файлов
 */
public class ConvertManager {
    private final String fileName;
    private final ConsoleFunctional consoleFunctional;

    public ConvertManager(String fileName, ConsoleFunctional consoleFunctional) {
        this.fileName = fileName;
        this.consoleFunctional = consoleFunctional;
    }

    /**
     * Сериализует коллекцию HumanBeing в CSV-файл.
     * Путь к файлу может быть переопределен переменной окружения HUMAN_DATA_FILE
     * @param collection коллекция для сохранения
     */
    public void writeCollection(Collection<HumanBeing> collection) {
        String effectivePath = System.getenv().getOrDefault("HUMAN_DATA_FILE", this.fileName);
        Path filePath = Paths.get(effectivePath).toAbsolutePath();
        consoleFunctional.println("Файл будет сохранен по пути: " + filePath);
        try (BufferedWriter writer = Files.newBufferedWriter(filePath, StandardCharsets.UTF_8)) {
            HeaderColumnNameMappingStrategy<HumanBeing> strategy = new HeaderColumnNameMappingStrategy<>();
            strategy.setType(HumanBeing.class);

            Comparator<String> columnOrderComparator = Comparator
                    .comparingInt((String column) -> {
                        String[] desiredOrder = {
                                "NAME", "COORDINATES", "CREATIONDATE", "REALHERO",
                                "HASTOOTHPICK", "IMPACTSPEED", "SOUNDTRACKNAME",
                                "MINUTESOFWAITING", "MOOD", "CAR"
                        };
                        for (int i = 0; i < desiredOrder.length; i++) {
                            if (desiredOrder[i].equals(column)) {
                                return i;
                            }
                        }
                        return Integer.MAX_VALUE;
                    });
            strategy.setColumnOrderOnWrite(columnOrderComparator);

            StatefulBeanToCsv<HumanBeing> beanToCsv = new StatefulBeanToCsvBuilder<HumanBeing>(writer)
                    .withMappingStrategy(strategy)
                    .withApplyQuotesToAll(false)
                    .build();
            beanToCsv.write(new ArrayList<>(collection));
            consoleFunctional.println("Коллекция успешно сохранена в CSV!");
        } catch (IOException | CsvDataTypeMismatchException | CsvRequiredFieldEmptyException e) {
            consoleFunctional.printError("Ошибка записи в CSV: " + e.getMessage());
        }
    }

    /**
     * Десериализует коллекцию HumanBeing из CSV-файла
     *
     * @return TreeSet загруженных объектов HumanBeing, отсортированных по ID
     * @throws RuntimeException при ошибках обработки данных
     */
    public Collection<HumanBeing> readCollection() {

        try (Reader reader = new InputStreamReader(new FileInputStream(fileName), StandardCharsets.UTF_8)) {

            Thread.setDefaultUncaughtExceptionHandler((thread, ex) -> {});
            HeaderColumnNameMappingStrategy<HumanBeing> strategy = new HeaderColumnNameMappingStrategy<>();
            strategy.setType(HumanBeing.class);
            Map<Class<?>, AbstractBeanField<?, ?>> converters = new HashMap<>();
            converters.put(Coordinates.class, new CoordinatesConverter());
            converters.put(ZonedDateTime.class, new ZonedDateTimeConverter());

            // Регистрируем конвертеры для сложных типов
            CsvToBean<HumanBeing> csvToBean = new CsvToBeanBuilder<HumanBeing>(reader)
                    .withType(HumanBeing.class)
                    .withMappingStrategy(strategy)
                    .withIgnoreLeadingWhiteSpace(true)
                    .withThrowExceptions(false)
                    .withIgnoreEmptyLine(true)
                    .build();
            List<HumanBeing> parsed = csvToBean.parse();
            if (!csvToBean.getCapturedExceptions().isEmpty()) {
                csvToBean.getCapturedExceptions().forEach(ex ->
                        consoleFunctional.printError("Ошибка в строке " + ex.getLineNumber() + ": " + ex.getMessage())
                );
                return new TreeSet<>();
            }
            if (parsed.isEmpty()) {
                consoleFunctional.println("Файл пустой или не содержит валидных данных");
                return new TreeSet<>();
            }
            TreeSet<HumanBeing> loaded = new TreeSet<>(
                    Comparator.comparing(HumanBeing::getId)
            );
            loaded.addAll(parsed);
            //TreeSet<HumanBeing> loaded = new TreeSet<>(csvToBean.parse());
            consoleFunctional.println("Коллекция успешно загружена из CSV");
            return loaded;

        } catch (NoSuchElementException e) {
            consoleFunctional.printError("Файл CSV не найден: " + fileName);
        } catch (IOException e) {
            consoleFunctional.printError("Ошибка чтения файла: " + e.getMessage());
        } catch (RuntimeException e) {
            consoleFunctional.printError("Ошибка обработки данных: " + e.getMessage());

        }
        return new TreeSet<>();
    }
}