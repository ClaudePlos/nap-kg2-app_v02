package pl.kskowronski.endpoints.kg;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import pl.kskowronski.data.entities.TransactionDTO;
import pl.kskowronski.data.services.EgeriaService;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class TransactionsEndpoint {

    private EgeriaService egeriaService;

    public TransactionsEndpoint(EgeriaService egeriaService) {
        this.egeriaService = egeriaService;
    }

    public @Nonnull List<@Nonnull TransactionDTO> getTransactionsForAccountAndPeriod(Integer frmId, String dateFrom, String dateTo, String account ) {
        egeriaService.setConsolidateCompanyOnCompany(frmId);
        List<TransactionDTO> ret = egeriaService.getTransactionsForAccountAndPeriod(frmId, dateFrom, dateTo, account);
        return ret;
    }




}
