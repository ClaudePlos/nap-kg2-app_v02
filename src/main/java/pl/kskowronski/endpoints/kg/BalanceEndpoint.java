package pl.kskowronski.endpoints.kg;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import pl.kskowronski.data.services.EgeriaService;

@Endpoint
@AnonymousAllowed
public class BalanceEndpoint {

    private EgeriaService egeriaService;

    public BalanceEndpoint(EgeriaService egeriaService) {
        this.egeriaService = egeriaService;
    }


    public String calculateBalance( Integer frmIdCompanyTo, String dateFrom, String dateTo ) {
        String ret = "ok";
        return ret;
    }


}
