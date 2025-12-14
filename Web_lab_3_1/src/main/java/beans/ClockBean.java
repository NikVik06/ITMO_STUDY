package beans;

import jakarta.annotation.ManagedBean;
import jakarta.enterprise.context.RequestScoped;
import jakarta.inject.Named;
import java.io.Serializable;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

@Named
@RequestScoped
public class ClockBean implements Serializable {

    public String getCurrentDateTime() {
        SimpleDateFormat sdf = new SimpleDateFormat("dd MMMM yyyy HH:mm:ss", new Locale("ru"));
        return sdf.format(new Date());
    }
}
