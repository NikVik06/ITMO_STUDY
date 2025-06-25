package transfer.commands.requests;


import transfer.commands.Commands;

public class FilterByMinutesOfWaitingRequest extends Request {
    public final int minutesOfWaiting;
    public FilterByMinutesOfWaitingRequest(int minutesOfWaiting) {
        super(Commands.FILTER_BY_MINUTES_OF_WAITING);
        this.minutesOfWaiting = minutesOfWaiting;
    }
}