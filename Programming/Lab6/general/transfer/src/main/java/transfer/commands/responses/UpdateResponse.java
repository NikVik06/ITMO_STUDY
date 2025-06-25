package transfer.commands.responses;


import transfer.commands.Commands;

public class UpdateResponse extends Response {
    public UpdateResponse(String error) {
        super(Commands.UPDATE_BY_ID, error);
    }
}