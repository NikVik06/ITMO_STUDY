package pokemons;

import ru.ifmo.se.pokemon.Type;
import attacks.special.FrostBreath;

public class Dewgong extends Seel {
    public Dewgong(String name, int lvl) {
        super(name,lvl);
        this.setStats(90.0, 70.0, 80.0, 70.0, 95.0, 70.0);
        //проверить работу функция для получения новых значений
        addType(Type.ICE);
        this.addMove((new FrostBreath()));
    }
}
