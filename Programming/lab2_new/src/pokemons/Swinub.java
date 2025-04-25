package pokemons;

import ru.ifmo.se.pokemon.Move;
import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Type;
import attacks.special.MudSlap;
import attacks.status.Swagger;
public class Swinub extends Pokemon {
    public Swinub(String name,int lvl) {
        super(name,lvl);
        this.setStats(50.0, 50.0, 40.0, 30.0, 30.0, 50.0);
        Type[] types3 = new Type[]{Type.ICE,Type.GROUND};
        this.setType(types3);
        Move[] moves3 = new Move[]{(new MudSlap()),(new Swagger())};
        this.setMove(moves3);
    }
}
//(new Swagger()
