package transfer.commands.responses;


import transfer.commands.Commands;

public class ClearResponse extends Response {
    public ClearResponse(String error) {
        super(Commands.CLEAR, error);
    }
}
