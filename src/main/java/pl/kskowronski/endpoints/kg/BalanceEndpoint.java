package pl.kskowronski.endpoints.kg;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import pl.kskowronski.data.entities.BalanceDTO;
import pl.kskowronski.data.services.EgeriaService;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class BalanceEndpoint {

    private EgeriaService egeriaService;

    public BalanceEndpoint(EgeriaService egeriaService) {
        this.egeriaService = egeriaService;
    }


    public @Nonnull List<@Nonnull BalanceDTO> calculateBalance( Integer frmId, String dateFrom, String dateTo, String mask ) {
        egeriaService.setConsolidateCompanyOnCompany(frmId);
        List<BalanceDTO> ret = egeriaService.calculateBalance(frmId, dateFrom, dateTo, mask);
        return ret;
    }


}
