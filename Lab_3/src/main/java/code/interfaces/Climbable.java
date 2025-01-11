package code.interfaces;

import code.buildings.Drainpipe;
import code.exceptions.DrainpipeNotFoundException;

public interface Climbable {
    String climb(Drainpipe drainpipe) throws DrainpipeNotFoundException;
}
