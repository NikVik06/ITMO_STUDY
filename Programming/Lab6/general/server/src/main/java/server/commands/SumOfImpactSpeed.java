package server.commands;


import server.controlCollection.HumanBeingRepository;
import transfer.base.HumanBeing;
import transfer.commands.requests.Request;
import transfer.commands.responses.Response;
import transfer.commands.responses.SumOfImpactSpeedResponse;

public class SumOfImpactSpeed extends Command {
    private final HumanBeingRepository humanBeingRepository;

    public SumOfImpactSpeed(HumanBeingRepository humanBeingRepository) {
        super("sum_of_impact_speed", "вывести сумму значений поля impactSpeed всех элементов коллекции");
        this.humanBeingRepository = humanBeingRepository;
    }

    @Override
    public Response execute(Request request) {
        try {
            int sum = getSumOfImpactSpeed();
            return new SumOfImpactSpeedResponse(sum, null);
        } catch (Exception e) {
            return new SumOfImpactSpeedResponse(-1, "Ошибка при вычислении суммы скорости: " + e.getMessage());
        }
    }

    private int getSumOfImpactSpeed() {
         double doubleSum = humanBeingRepository.get().stream()
                .mapToDouble(HumanBeing::getImpactSpeed)
                .sum();
        return (int) doubleSum;
    }
}