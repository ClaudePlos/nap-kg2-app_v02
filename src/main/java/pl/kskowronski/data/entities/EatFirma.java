package pl.kskowronski.data.entities;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import java.math.BigDecimal;

@Entity
@Table(name = "EAT_FIRMY")
public class EatFirma {

    @Id
    @Column(name = "FRM_ID")
    private BigDecimal frmId;

    @Column(name = "FRM_NAZWA")
    private String frmName;

    @Column(name = "FRM_KL_ID")
    private BigDecimal frmKlId;

    @Column(name = "FRM_OPIS")
    private String frmDesc;

    public EatFirma() {
    }

    public BigDecimal getFrmId() {
        return frmId;
    }

    public void setFrmId(BigDecimal frmId) {
        this.frmId = frmId;
    }

    public String getFrmName() {
        return frmName;
    }

    public void setFrmName(String frmName) {
        this.frmName = frmName;
    }

    public BigDecimal getFrmKlId() {
        return frmKlId;
    }

    public void setFrmKlId(BigDecimal frmKlId) {
        this.frmKlId = frmKlId;
    }

    public String getFrmDesc() {
        return frmDesc;
    }

    public void setFrmDesc(String frmDesc) {
        this.frmDesc = frmDesc;
    }
}