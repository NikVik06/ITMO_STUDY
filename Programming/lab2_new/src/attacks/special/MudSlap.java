package attacks.special;

import ru.ifmo.se.pokemon.SpecialMove;
import ru.ifmo.se.pokemon.Stat;
import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Type;
public final class MudSlap extends SpecialMove {
    public MudSlap() {
        super(Type.GROUND,20.0,100.0);
    }
    @Override
    protected void applyOppEffects(Pokemon pokemon) {
        pokemon.setMod(Stat.ACCURACY, -1);
    }
    @Override
    protected String describe() {
        return "использовал MudSlap";
    }
}
