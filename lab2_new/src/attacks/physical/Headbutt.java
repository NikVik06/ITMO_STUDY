package attacks.physical;


import ru.ifmo.se.pokemon.Effect;
import ru.ifmo.se.pokemon.PhysicalMove;
import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Type;
public final class Headbutt extends PhysicalMove {
    public Headbutt() {
        super(Type.NORMAL,70.0,100.0);
    }
    @Override
    protected void applyOppEffects(Pokemon pokemon) {
        if (Math.random() <= 0.3) {
            Effect.flinch(pokemon);
        }
    }
    @Override
    protected String describe() {
        return "использовал Headbutt";
    }
}
