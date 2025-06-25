package transfer.commands.responses;


import transfer.base.HumanBeing;
import transfer.commands.Commands;

import java.util.Collections;
import java.util.List;

public class PrintFieldDescendingImpactSpeedResponse extends Response {
    public final List<Double> impactSpeeds;

    public PrintFieldDescendingImpactSpeedResponse(List<Double> impactSpeeds, String error) {
        super(Commands.PRINT_FIELD_DESCENDING_IMPACT_SPEED, error);
        this.impactSpeeds = impactSpeeds;
    }
}