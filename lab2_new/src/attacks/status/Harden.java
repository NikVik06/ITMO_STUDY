package attacks.status;


import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Stat;
import ru.ifmo.se.pokemon.StatusMove;
import ru.ifmo.se.pokemon.Type;
public final class Harden extends StatusMove {
    public Harden() {
        super(Type.NORMAL,0.0,0.0);
    }
    @Override
    protected void applySelfEffects(Pokemon pokemon) {
        pokemon.setMod(Stat.DEFENSE, +1);
    }
    @Override
    protected String describe() {
        return "использовал Harden";
    }
}
