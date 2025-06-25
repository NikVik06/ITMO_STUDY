package transfer.commands.requests;


import transfer.commands.Commands;

public class PrintDescendingRequest extends Request {
    public PrintDescendingRequest() {
        super(Commands.PRINT_DESCENDING);
    }
}