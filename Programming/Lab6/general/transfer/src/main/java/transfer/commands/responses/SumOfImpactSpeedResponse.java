package transfer.commands.responses;


import transfer.commands.Commands;

public class SumOfImpactSpeedResponse extends Response {
    public final int sum;

    public SumOfImpactSpeedResponse(int sum, String error) {
        super(Commands.SUM_OF_IMPACT_SPEED, error);
        this.sum = sum;
    }
}