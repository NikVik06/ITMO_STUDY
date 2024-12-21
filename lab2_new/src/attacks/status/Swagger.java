package attacks.status;

import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Stat;
import ru.ifmo.se.pokemon.StatusMove;
import ru.ifmo.se.pokemon.Type;


public final class Swagger extends StatusMove {
    public Swagger() {
        super(Type.NORMAL,0.0,85.0);
    }
    @Override
    protected void applyOppEffects(Pokemon effect2) {
            effect2.confuse();
            effect2.setMod(Stat.ATTACK,2);
    }
    @Override
    protected String describe() {
        return "использовал Swagger";
    }
}
