package pokemons;

import attacks.special.IcyWind;

public class Piloswine extends Swinub {
    public Piloswine(String name, int lvl) {
        super(name,lvl);
        this.setStats(100.0, 100.0, 80.0, 60.0, 60.0, 50.0);
        //проверить работу функция для получения новых значений
        this.addMove((new IcyWind()));
    }
}
