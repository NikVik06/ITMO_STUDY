package attacks.special;

import ru.ifmo.se.pokemon.SpecialMove;

import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Type;
public final class FrostBreath extends SpecialMove {
    public FrostBreath() {
        super(Type.ICE,90.0,90.0);
    }
    @Override
    protected String describe() {
        return "использовал FrostBreathe";
    }
}
