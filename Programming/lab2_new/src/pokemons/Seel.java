package pokemons;

import ru.ifmo.se.pokemon.Move;
import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Type;
import attacks.physical.Waterfall;
import attacks.physical.Headbutt;
import attacks.status.DoubleTeam;
public class Seel extends Pokemon {
    public Seel(String name,int lvl) {
        super(name,lvl);
        this.setStats(65.0, 45.0, 55.0, 45.0, 70.0, 45.0);
        Type[] types2 = new Type[]{Type.WATER};
        this.setType(types2);
        Move[] moves2 = new Move[]{(new DoubleTeam()), (new Headbutt()),(new Waterfall())};
        this.setMove(moves2);
    }
}
