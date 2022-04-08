package pl.kskowronski.data.services;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pl.kskowronski.data.entities.EatFirma;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface EatFirmaRepo extends JpaRepository<EatFirma, BigDecimal> {

    Optional<EatFirma> findById(BigDecimal frmId);

    Optional<EatFirma> findByFrmName(String frmName);

    @Query("select f from EatFirma f where f.frmDesc != 'M'")
    List<EatFirma> findAllForGroup();

}