package transfer.commands.requests;


import transfer.base.HumanBeing;
import transfer.commands.Commands;

public class AddIfMinRequest extends Request {
    public final HumanBeing humanBeing;
    public AddIfMinRequest(HumanBeing humanBeing) {
        super(Commands.ADD_IF_MIN);
        this.humanBeing = humanBeing;
    }
}