package server;

import com.fastcgi.FCGIInterface;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;

public class Main {
    private static final String RESULT_JSON = """
            {
                "now": "%s",
                "time": %d,
                "result": %b
            }""";

    private static final String ERROR_JSON = """
            {
                "now": "%s",
                "reason": "%s"
            }""";

    public static void main(String[] args) {
        var fcgi = new FCGIInterface();

        System.err.println("FastCGI сервер запущен");

        while (fcgi.FCGIaccept() >= 0) {
            try {
                var queryParams = System.getProperty("QUERY_STRING");
                System.err.println("Принятый запрос: " + queryParams);

                var params = new Params(queryParams);
                var startTime = Instant.now();
                var result = calculate(params.getX(), params.getY(), params.getR());
                var endTime = Instant.now();

                var json = String.format(RESULT_JSON,
                        LocalDateTime.now(ZoneId.of("Europe/Moscow")),
                        ChronoUnit.NANOS.between(startTime, endTime),
                        result
                );

                System.out.println("Content-Type: application/json");
                System.out.println();
                System.out.println(json);

            } catch (ValidationException e) {
                System.err.println("Validation error: " + e.getMessage());
                var json = String.format(ERROR_JSON, LocalDateTime.now(), e.getMessage());

                System.out.println("Content-Type: application/json");
                System.out.println("Status: 400 Bad Request");
                System.out.println();
                System.out.println(json);
            } catch (Exception e) {
                System.err.println("Unexpected error: " + e.getMessage());
                e.printStackTrace();
                var json = String.format(ERROR_JSON, LocalDateTime.now(), "Internal server error");

                System.out.println("Content-Type: application/json");
                System.out.println("Status: 500 Internal Server Error");
                System.out.println();
                System.out.println(json);
            }
        }
    }

    private static boolean calculate(float x, float y, float r) {
        if (x <= 0 && x <= -r/2 && y >= 0 && y <= r) {
            return true;
        }


        if (x >= 0 && y >= 0 && y <= -x + r) {
            return true;
        }


        if (x >= 0 && y <= 0 && (x*x + y*y) <= (r/2)*(r/2)) {
            return true;
        }

        return false;
    }
}