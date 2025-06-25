package transfer.commands.responses;


import transfer.base.HumanBeing;
import transfer.commands.Commands;

import java.util.List;

public class FilterByMinutesOfWaitingResponse extends Response {
    public final List<HumanBeing> filteredHumanBeing;

    public FilterByMinutesOfWaitingResponse(List<HumanBeing> filteredHumanBeing, String error) {
        super(Commands.FILTER_BY_MINUTES_OF_WAITING, error);
        this.filteredHumanBeing = filteredHumanBeing;
    }
}