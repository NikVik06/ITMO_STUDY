package attacks.physical;


import ru.ifmo.se.pokemon.Effect;
import ru.ifmo.se.pokemon.PhysicalMove;
import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Type;
public final class Waterfall extends PhysicalMove {
    public Waterfall() {
        super(Type.WATER,80.0,100.0);
    }
    @Override
    protected void applyOppEffects(Pokemon pokemon) {
        if (Math.random() <= 0.2) {
            Effect.flinch(pokemon);
        }
    }
    @Override
    protected String describe() {
        return "использовал Waterfall";
    }
}
