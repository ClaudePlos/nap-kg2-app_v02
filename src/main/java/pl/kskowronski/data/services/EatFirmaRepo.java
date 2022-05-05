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

    @Query("select f from EatFirma f where f.frmName not like '%NIZAN%'")
    List<EatFirma> findAllForGroup();

    @Query("select f from EatFirma f where f.frmId in (300000,300170,300201,300203,300202,300305,300313,300317,300319,300304,300322,300315,300303,300314)")
    List<EatFirma> findAllForGroupCapital();

    @Query("select f from EatFirma f where f.frmId in (300000,300170,300201,300203,300202,300305,300313,300317,300319,300304,300322,300315,300303,300314)")
    List<EatFirma> findAll();

}