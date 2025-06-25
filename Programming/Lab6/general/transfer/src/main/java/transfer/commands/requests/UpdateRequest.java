package transfer.commands.requests;


import transfer.base.HumanBeing;
import transfer.commands.Commands;

public class UpdateRequest extends Request {
    public final int id;
    public final HumanBeing updatedHumanBeing;

    public UpdateRequest(int id, HumanBeing updatedHumanBeing) {
        super(Commands.UPDATE_BY_ID);
        this.id = id;
        this.updatedHumanBeing = updatedHumanBeing;
    }
}