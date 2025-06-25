package transfer.structure;
import transfer.base.*;
import java.util.Comparator;

public class HumanBeingComparator implements Comparator<HumanBeing> {
    public int compare(HumanBeing a, HumanBeing b){
        return a.getSoundtrackName().compareTo(b.getSoundtrackName());
    }
}
