package transfer.commands.requests;


import transfer.base.HumanBeing;
import transfer.commands.Commands;

public class AddRequest extends Request {
    public final HumanBeing humanBeing;
    public AddRequest(HumanBeing humanBeing) {
        super(Commands.ADD);
        this.humanBeing = humanBeing;
    }
}