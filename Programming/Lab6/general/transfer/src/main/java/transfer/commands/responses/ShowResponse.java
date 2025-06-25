package transfer.commands.responses;



import transfer.base.HumanBeing;
import transfer.commands.Commands;

import java.util.List;

public class ShowResponse extends Response {
    public final List<HumanBeing> humanBeing;

    public ShowResponse(List<HumanBeing> humanBeing, String error) {
        super(Commands.SHOW, error);
        this.humanBeing = humanBeing;
    }
}