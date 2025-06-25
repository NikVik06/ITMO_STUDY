package transfer.commands.requests;


import transfer.commands.Commands;

public class RemoveByIdRequest extends Request {
    public final int id;

    public RemoveByIdRequest(int id) {
        super(Commands.REMOVE_BY_ID);
        this.id = id;
    }
}