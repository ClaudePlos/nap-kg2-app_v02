package pl.kskowronski.endpoints.kg;


import com.vaadin.flow.server.auth.AnonymousAllowed;
import dev.hilla.Endpoint;
import dev.hilla.Nonnull;
import pl.kskowronski.data.entities.MovementDTO;
import pl.kskowronski.data.services.EgeriaService;

import java.util.List;

@Endpoint
@AnonymousAllowed
public class MovementsEndpoint {

    private EgeriaService egeriaService;

    public MovementsEndpoint(EgeriaService egeriaService) {
        this.egeriaService = egeriaService;
    }

    public @Nonnull List<@Nonnull MovementDTO> calculateTurnover(String dateFrom, String dateTo, String mask) {
        //System.out.println( "ksko:" + frmId + " " + dateFrom + " " + dateTo + " " + mask);
        egeriaService.setConsolidateCompany();
        List<MovementDTO> ret = egeriaService.calculateTurnover( dateFrom, dateTo, mask);
        return ret;
    }


}
