package transfer.commands.responses;


import transfer.commands.Commands;

public class AddResponse extends Response {
    public final long newId;

    public AddResponse(long newId, String error) {
        super(Commands.ADD, error);
        this.newId = newId;
    }
}