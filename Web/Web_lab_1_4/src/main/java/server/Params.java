package server;

import java.util.HashMap;
import java.util.Map;

public class Params {
    private final float x;
    private final float y;
    private final float r;

    public Params(String queryString) throws ValidationException {
        Map<String, String> params = parseQueryString(queryString);

        this.x = parseFloatParam(params, "x");
        this.y = parseFloatParam(params, "y");
        this.r = parseFloatParam(params, "r");

        validate();
    }

    private Map<String, String> parseQueryString(String queryString) {
        Map<String, String> params = new HashMap<>();
        if (queryString != null && !queryString.isEmpty()) {
            String[] pairs = queryString.split("&");
            for (String pair : pairs) {
                String[] keyValue = pair.split("=");
                if (keyValue.length == 2) {
                    params.put(keyValue[0], keyValue[1]);
                }
            }
        }
        return params;
    }

    private float parseFloatParam(Map<String, String> params, String paramName) throws ValidationException {
        String value = params.get(paramName);
        if (value == null) {
            throw new ValidationException(paramName + " is required");
        }
        try {
            value = value.replace(',', '.');
            return Float.parseFloat(value);
        } catch (NumberFormatException e) {
            throw new ValidationException(paramName + " is not a number: " + value);
        }
    }

    private void validate() throws ValidationException {

        if (x < -5 || x > 3) {
            throw new ValidationException("x должен быть между -5 и 3");
        }


        if (y < -2 || y > 2) {
            throw new ValidationException("y должен быть между -2 и 2");
        }


        if (r != 1.0f && r != 1.5f && r != 2.0f && r != 2.5f && r != 3.0f) {
            throw new ValidationException("r должен быть: 1, 1.5, 2, 2.5, 3");
        }
    }

    public float getX() { return x; }
    public float getY() { return y; }
    public float getR() { return r; }
}