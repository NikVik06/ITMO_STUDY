package transfer.commands.responses;


import transfer.base.HumanBeing;
import transfer.commands.Commands;
import java.util.List;

public class PrintDescendingResponse extends Response {
    public final List<HumanBeing> humanBeing;

    public PrintDescendingResponse(List<HumanBeing> humanBeing, String error) {
        super(Commands.PRINT_DESCENDING, error);
        this.humanBeing = humanBeing;
    }
}