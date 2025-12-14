package validators;

import jakarta.faces.application.FacesMessage;
import jakarta.faces.component.UIComponent;
import jakarta.faces.context.FacesContext;
import jakarta.faces.validator.FacesValidator;
import jakarta.faces.validator.Validator;
import jakarta.faces.validator.ValidatorException;
import java.util.regex.Pattern;

@FacesValidator("numberValidator")
public class NumberValidator implements Validator<Object> {

    private static final Pattern NUMBER_PATTERN = Pattern.compile("^-?\\d+(\\.\\d+)?$");

    @Override
    public void validate(FacesContext context, UIComponent component, Object value)
            throws ValidatorException {

        if (value == null || value.toString().trim().isEmpty()) {
            return;
        }

        String strValue = value.toString().trim();

        if (!NUMBER_PATTERN.matcher(strValue).matches()) {
            FacesMessage msg = new FacesMessage(
                    FacesMessage.SEVERITY_ERROR,
                    "Некорректный формат числа",
                    "Введите число в правильном формате (например: 1.5, -2, 3.0)"
            );
            throw new ValidatorException(msg);
        }

        try {
            Double.parseDouble(strValue);
        } catch (NumberFormatException e) {
            FacesMessage msg = new FacesMessage(
                    FacesMessage.SEVERITY_ERROR,
                    "Некорректное число",
                    "Введите корректное число"
            );
            throw new ValidatorException(msg);
        }
    }
}