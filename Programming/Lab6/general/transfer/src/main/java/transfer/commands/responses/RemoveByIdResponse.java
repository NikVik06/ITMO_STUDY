package transfer.commands.responses;


import transfer.commands.Commands;

public class RemoveByIdResponse extends Response {
    public final boolean success;
    public RemoveByIdResponse(boolean success, String error) {
        super(Commands.REMOVE_BY_ID, error);
        this.success = success;

    }
}