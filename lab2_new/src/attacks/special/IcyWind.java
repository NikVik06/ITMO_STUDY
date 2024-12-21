package attacks.special;

import ru.ifmo.se.pokemon.SpecialMove;
import ru.ifmo.se.pokemon.Stat;
import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Type;
public final class IcyWind extends SpecialMove {
    public IcyWind() {
        super(Type.ICE,55.0,95.0);
    }
    @Override
    protected void applyOppEffects(Pokemon pokemon) {
        pokemon.setMod(Stat.SPEED, -1);
    }
    @Override
    protected String describe() {
        return "использовал IcyWind";
    }
}
