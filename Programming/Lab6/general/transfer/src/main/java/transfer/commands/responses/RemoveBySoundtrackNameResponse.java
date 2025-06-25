package transfer.commands.responses;


import transfer.commands.Commands;

public class RemoveBySoundtrackNameResponse extends Response {
    public final int removedCount;
    public RemoveBySoundtrackNameResponse(int removedCount,String error) {
        super(Commands.REMOVE_BY_SOUNDTRACK_NAME, error);
        this.removedCount = removedCount;

    }
}