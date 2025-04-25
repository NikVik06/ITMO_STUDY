package attacks.status;

import ru.ifmo.se.pokemon.Effect;
import ru.ifmo.se.pokemon.Pokemon;
import ru.ifmo.se.pokemon.Stat;
import ru.ifmo.se.pokemon.StatusMove;
import ru.ifmo.se.pokemon.Type;
import ru.ifmo.se.pokemon.Status;
public final class Rest extends StatusMove {
    public Rest() {
        super(Type.PSYCHIC,0.0,0.0);
    }
    @Override
    protected void applySelfEffects(Pokemon att) {
        Effect effect = new Effect();
        effect = effect.condition(Status.SLEEP);
        effect = effect.turns(2);
        att.restore();
        att.addEffect(effect);
        //att.setMod(Stat.HP,6);
    }
    protected boolean checkAccuracy(Pokemon att,Pokemon def){
        return true;
    }

    @Override
    protected String describe() {
        return "использовал Rest";
    }
}
