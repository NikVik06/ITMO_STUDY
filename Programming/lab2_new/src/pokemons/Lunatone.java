// Source code is decompiled from a .class file using FernFlower decompiler.
package pokemons;


import ru.ifmo.se.pokemon.Move;
import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Type;
import attacks.physical.RockThrow;
import attacks.status.DoubleTeam;
import attacks.status.Rest;
import attacks.status.Harden;

public final class Lunatone extends Pokemon {
    public Lunatone(String name, int lvl) {
        super(name, lvl);
        this.setStats(90.0,55.0,65.0,95.0,85.0,70.0);
        Type[] types1 = new Type[]{Type.ROCK, Type.PSYCHIC};
        this.setType(types1);
        Move[] moves1 = new Move[]{(new Harden()),(new DoubleTeam()),(new RockThrow()),(new Rest())};
        this.setMove(moves1);
    }
}
