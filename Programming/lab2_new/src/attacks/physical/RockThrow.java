package attacks.physical;
import ru.ifmo.se.pokemon.PhysicalMove;
import ru.ifmo.se.pokemon.Type;

public final class RockThrow extends PhysicalMove {
    public RockThrow() {
        super(Type.ROCK,50.0,90.0);
    }
    @Override
    protected String describe() {
        return "использовал RockThrow";
    }
}
