package project.managers;

import project.models.HumanBeing;
import project.structure.Console;
import java.time.ZonedDateTime;
import java.util.TreeSet;
import java.util.Set;
import java.util.Optional;

/**
 * Управляет коллекцией человеческое сущеность
 */
public class CollectionManager {
    private final TreeSet<HumanBeing> collection = new TreeSet<>();
    private ZonedDateTime lastInitTime;
    private ZonedDateTime lastSaveTime;
    private final ConvertManager convertManager;

    public CollectionManager(ConvertManager convertManager) {
        this.convertManager = convertManager;
        this.lastInitTime = null;
        this.lastSaveTime = null;
        loadCollection();
    }

    public Set<HumanBeing> getCollection() {
        return new TreeSet<>(collection); // Возвращаем копию для безопасности
    }
    /**
     * Возвращает тип коллекции
     * @return полное имя класса коллекции
     */
    public String collectionType() {
        return collection.getClass().getName();
    }
    /**
     * Добавляет элемент в коллекцию
     * @param humanBeing Элемент для добавления.
     */
    public void addToCollection(HumanBeing humanBeing) {
        collection.add(humanBeing);
    }
    /**
     * Очищает коллекцию
     */
    public void clearCollection() {
        collection.clear();
    }
    /**
     * Возвращает размер коллекции
     * @return количество элементов в коллекции
     */
    public int sizeCollection() {
        return collection.size();
    }
    /**
     * Возвращает последнее время инициализации коллекции
     * @return Последнее время инициализации
     */
    public ZonedDateTime getLastInitTime() {
        return lastInitTime;
    }
    /**
     * Возвращает последнее время сохранения коллекции
     * @return Последнее время сохранения
     */
    public ZonedDateTime getLastSaveTime() {
        return lastSaveTime;
    }

    /**
     * Удаляет элемент из коллекции
     * @param humanBeing Элемент для удаления
     */
    public void removeFromCollection(HumanBeing humanBeing) {
        collection.remove(humanBeing);
    }

    /**
     * Сохраняет коллекцию в файл
     * Обновляет время последней инициализации
     */
    public void loadCollection() {
        collection.clear();
        collection.addAll(convertManager.readCollection());
        lastInitTime = ZonedDateTime.now();
    }
    /**
     * Сохраняет коллекцию в файл
     * Обновляет время последнего сохранения
     */
    public void saveCollection() {
        convertManager.writeCollection(collection);
        lastSaveTime = ZonedDateTime.now();
    }
    /**
     * Находит элемент по идентификатору
     * @param id искомый идентификатор
     * @return найденный элемент или null если не найден
     */
    public HumanBeing getById(int id) {
        return collection.stream()
                .filter(h -> h.getId() == id)
                .findFirst()
                .orElse(null);
    }


    @Override
    public String toString() {
        if (collection.isEmpty()) {
            return "Коллекция пуста";
        }
        StringBuilder sb = new StringBuilder();
        collection.forEach(h -> sb.append(h).append("\n"));
        return sb.toString();
    }
}