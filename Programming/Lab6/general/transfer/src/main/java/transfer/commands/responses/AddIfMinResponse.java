package transfer.commands.responses;


import transfer.commands.Commands;

public class AddIfMinResponse extends Response {
    public final boolean isAdded;
    public final long newId;

    public AddIfMinResponse(boolean isAdded, long newId, String error) {
        super(Commands.ADD_IF_MIN, error);
        this.isAdded = isAdded;
        this.newId = newId;
    }
}