package pl.kskowronski.endpoints.kg;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import pl.kskowronski.data.entities.BalanceDTO;
import pl.kskowronski.data.entities.EatFirma;
import pl.kskowronski.data.services.EatFirmaRepo;
import pl.kskowronski.data.services.EgeriaService;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Endpoint
@AnonymousAllowed
public class BalanceEndpoint {

    private EgeriaService egeriaService;
    private EatFirmaRepo eatFirmaRepo;

    public BalanceEndpoint(EgeriaService egeriaService, EatFirmaRepo eatFirmaRepo) {
        this.egeriaService = egeriaService;
        this.eatFirmaRepo = eatFirmaRepo;
    }


    public @Nonnull List<@Nonnull BalanceDTO> calculateBalance( Integer frmId, String dateFrom, String dateTo, String mask ) {
        egeriaService.setConsolidateCompanyOnCompany(frmId);
        List<BalanceDTO> ret = egeriaService.calculateBalance(eatFirmaRepo.findById(BigDecimal.valueOf(frmId)).get().getFrmName(), dateFrom, dateTo, mask);
        return ret;
    }


    public @Nonnull List<@Nonnull BalanceDTO> calculateBalanceForCompaniesInGK(String dateFrom, String dateTo, String mask ) {
        List<EatFirma> companies = eatFirmaRepo.findAllForGroupCapital();
        List<BalanceDTO> ret = new ArrayList<>();
        companies.forEach( item -> {
            egeriaService.setConsolidateCompanyOnCompany(item.getFrmId().intValue());
            List<BalanceDTO> r= egeriaService.calculateBalance(item.getFrmName(), dateFrom, dateTo, mask);
            ret.addAll(r);
        });
        return ret;
    }

}
