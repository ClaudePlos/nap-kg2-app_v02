package pl.kskowronski.endpoints.company;

import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import pl.kskowronski.data.entities.EatFirma;
import pl.kskowronski.data.services.EatFirmaRepo;

import java.util.ArrayList;
import java.util.List;

@Endpoint
@AnonymousAllowed
public class CompanyEndpoint {

    EatFirmaRepo eatFirmaRepo;

    public CompanyEndpoint(EatFirmaRepo eatFirmaRepo) {
        this.eatFirmaRepo = eatFirmaRepo;
    }

    public @Nonnull List<@Nonnull EatFirma> getCompanies() {

        List<EatFirma> companiesList = eatFirmaRepo.findAllForGroup();
        return companiesList;
    }

    public EatFirma save(EatFirma item) {
        //companiesList.add(item);
        return item;
    }

    public String copyAccountsToCompany( Integer klKodCompany, String mask, String year, String level ) {
        String response = "Skopiowane";

        return response + " do klKod: " + klKodCompany;
    }


}
