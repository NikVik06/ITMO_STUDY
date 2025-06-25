package server.controlCollection;

import server.App;
import server.managers.ConvertManager;
import transfer.base.HumanBeing;

import java.time.ZonedDateTime;
import java.util.*;

/**
 * Управляет коллекцией
 */
public class HumanBeingRepository {
    private TreeSet<HumanBeing> collection = new TreeSet<>();
    private ZonedDateTime lastInitTime;
    private ZonedDateTime lastSaveTime;
    private final ConvertManager convertManager;


    public HumanBeingRepository(ConvertManager convertManager) {
        this.convertManager = convertManager;
        this.lastInitTime = null;
        this.lastSaveTime = null;

        load();
    }

    public boolean validateAll() {
        for(var HumanBeing : new ArrayList<>(get())) {
            if (!HumanBeing.validate()) {
                App.logger.warn("Существо с id=" + HumanBeing.getId() + " имеет невалидные поля");
                return false;
            }
        };
        App.logger.info("Загруженные продукты валидны.");
        return true;
    }

    /**
     * @return коллекция.
     */
    public Set<HumanBeing> get() {
        return collection;
    }

    /**
     * @return Последнее время инициализации.
     */
    public ZonedDateTime getLastInitTime() {
        return lastInitTime;
    }

    /**
     * @return Последнее время сохранения.
     */
    public ZonedDateTime getLastSaveTime() {
        return lastSaveTime;
    }

    /**
     * @return Имя типа коллекции.
     */
    public String type() {
        return collection.getClass().getName();
    }

    /**
     * @return Размер коллекции.
     */
    public int size() {
        return collection.size();
    }

    /**
     * @return Первый элемент коллекции (null если коллекция пустая).
     */
    public HumanBeing first() {
        return collection.isEmpty() ? null : collection.first();
    }

    /**
     * @return Последний элемент коллекции (null если коллекция пустая).
     */
    public HumanBeing last() {
        return collection.isEmpty() ? null : collection.last();
    }

    /**
     * @return Отсортированная коллекция.
     */
    public List<HumanBeing> sorted() {
        return new ArrayList<>(collection);
    }

    /**
     * @param id ID элемента.
     * @return Элемент по его ID или null, если не найдено.
     */
    public HumanBeing getById(int id) {
        for (HumanBeing element : collection) {
            if (element.getId() == id) return element;
        }
        return null;
    }

    /**
     * @param id ID элемента.
     * @return Проверяет, существует ли элемент с таким ID.
     */
    public boolean checkExist(int id) {
        return getById(id) != null;
    }

    /**
     * @param elementToFind элемент, который нужно найти по значению.
     * @return Найденный элемент (null если нен найден).
     */
    public HumanBeing getByValue(HumanBeing elementToFind) {
        for (HumanBeing element : collection) {
            if (element.equals(elementToFind)) return element;
        }
        return null;
    }

    /**
     * Добавляет элемент в коллекцию
     * @param element Элемент для добавления.
     * @return id нового элемента
     */
    public long add(HumanBeing element) {
        int newId = collection.isEmpty()
                ? 1
                : collection.last().getId() + 1;  // TreeSet.last() работает за O(1)

        collection.add(element.copy(newId));  // Предполагается, что есть метод copy()
        return newId;
    }

    /**
     * Удаляет элемент из коллекции.
     * @param id ID элемента для удаления.
     */
    public void remove(int id) {
        collection.removeIf(HumanBeing -> HumanBeing.getId() == id);
    }

    /**
     * Очищает коллекцию.
     */
    public void clear() {
        collection.clear();
    }

    /**
     * Сохраняет коллекцию в файл
     */
    public void save() {
        convertManager.writeCollection(collection);  // Теперь convertManager уже инициализирован
        lastSaveTime = ZonedDateTime.now();
    }

    /**
     * Загружает коллекцию из файла.
     */
    private void load() {
        collection = (TreeSet<HumanBeing>) convertManager.readCollection();
        lastInitTime = ZonedDateTime.now();
    }


    @Override
    public String toString() {
        if (collection.isEmpty()) return "Коллекция пуста!";

        var info = new StringBuilder();
        for (HumanBeing HumanBeing : collection) {
            info.append(HumanBeing);
            info.append("\n\n");
        }
        return info.substring(0, info.length() - 2);
    }
}