package pl.kskowronski.endpoints.kg;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import pl.kskowronski.data.entities.EatFirma;
import pl.kskowronski.data.entities.TransactionDTO;
import pl.kskowronski.data.services.EatFirmaRepo;
import pl.kskowronski.data.services.EgeriaService;

import java.util.List;
import java.util.Optional;

@Endpoint
@AnonymousAllowed
public class TransactionsEndpoint {

    private EgeriaService egeriaService;
    private EatFirmaRepo eatFirmaRepo;

    public TransactionsEndpoint(EgeriaService egeriaService, EatFirmaRepo eatFirmaRepo) {
        this.egeriaService = egeriaService;
        this.eatFirmaRepo = eatFirmaRepo;
    }

    public @Nonnull List<@Nonnull TransactionDTO> getTransactionsForAccountAndPeriod(String frmName, String dateFrom, String dateTo, String account ) {
        Optional<EatFirma> frm = eatFirmaRepo.findByFrmName(frmName);
        egeriaService.setConsolidateCompanyOnCompany(frm.get().getFrmId().intValue());
        List<TransactionDTO> ret = egeriaService.getTransactionsForAccountAndPeriod(frm.get().getFrmId().intValue(), dateFrom, dateTo, account);
        return ret;
    }




}
