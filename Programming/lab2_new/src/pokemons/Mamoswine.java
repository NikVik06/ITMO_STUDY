package pokemons;

import attacks.status.ScaryFace;

public class Mamoswine extends Piloswine {
    public Mamoswine(String name,int lvl) {
        super(name,lvl);
        this.setStats(110.0, 130.0, 80.0, 70.0, 60.0, 80.0);
        this.addMove((new ScaryFace()));
    }
}
