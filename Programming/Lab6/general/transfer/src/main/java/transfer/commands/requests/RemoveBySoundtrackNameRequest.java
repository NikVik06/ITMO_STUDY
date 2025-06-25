package transfer.commands.requests;


import transfer.commands.Commands;

public class RemoveBySoundtrackNameRequest extends Request {
    public String soundtrackName;
    public RemoveBySoundtrackNameRequest(String soundtrackName) {
        super(Commands.REMOVE_BY_SOUNDTRACK_NAME);
        this.soundtrackName = soundtrackName;
    }
}