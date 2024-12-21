package attacks.status;

import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Stat;
import ru.ifmo.se.pokemon.StatusMove;
import ru.ifmo.se.pokemon.Type;

public final class ScaryFace extends StatusMove {
    public ScaryFace() {
        super(Type.NORMAL,0.0,100.0);
    }
    @Override
    protected void applyOppEffects(Pokemon pokemon) {
        pokemon.setMod(Stat.SPEED, -2);
    }
    @Override
    protected String describe() {
        return "использовал ScaryFace";
    }
}
