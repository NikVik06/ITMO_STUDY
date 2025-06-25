package transfer.commands.requests;


import transfer.commands.Commands;

public class HelpRequest extends Request {
    public HelpRequest() {
        super(Commands.HELP);
    }
}