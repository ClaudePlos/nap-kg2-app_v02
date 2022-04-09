package pl.kskowronski.endpoints.company;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import pl.kskowronski.data.entities.EatFirma;
import pl.kskowronski.data.services.EatFirmaRepo;
import pl.kskowronski.data.services.EgeriaService;

import java.util.ArrayList;
import java.util.List;

@Endpoint
@AnonymousAllowed
public class CompanyEndpoint {

    private EatFirmaRepo eatFirmaRepo;
    private EgeriaService egeriaService;

    public CompanyEndpoint(EatFirmaRepo eatFirmaRepo, EgeriaService egeriaService) {
        this.eatFirmaRepo = eatFirmaRepo;
        this.egeriaService = egeriaService;
    }

    public @Nonnull List<@Nonnull EatFirma> getCompanies() {
        List<EatFirma> companiesList = eatFirmaRepo.findAllForGroup();
        return companiesList;
    }

    public EatFirma save(EatFirma item) {
        //companiesList.add(item);
        return item;
    }

    public String copyAccountsToCompany( Integer frmIdCompanyTo, String mask, String year, String level ) {
        String ret = egeriaService.copyAccountToAnotherCompany(frmIdCompanyTo, mask, year, level);
        return ret;
    }



}
