package pl.kskowronski.data.entities;

import java.math.BigDecimal;
import java.util.Date;

public class TransactionDTO {

    private String  frmName;
    private String  account;
    private String  accountName;

    private BigDecimal wartosc;

    private String tresc;

    private BigDecimal wartoscWn;
    private BigDecimal wartoscMa;

    private String numerWlasny;
    private String numerObcy;

    private Date dataZaksiegowania;

    public TransactionDTO() {
    }

    public String getFrmName() {
        return frmName;
    }

    public void setFrmName(String frmName) {
        this.frmName = frmName;
    }

    public String getAccount() {
        return account;
    }

    public void setAccount(String account) {
        this.account = account;
    }

    public String getAccountName() {
        return accountName;
    }

    public void setAccountName(String accountName) {
        this.accountName = accountName;
    }

    public BigDecimal getWartoscWn() {
        return wartoscWn;
    }

    public void setWartoscWn(BigDecimal wartoscWn) {
        this.wartoscWn = wartoscWn;
    }

    public BigDecimal getWartoscMa() {
        return wartoscMa;
    }

    public void setWartoscMa(BigDecimal wartoscMa) {
        this.wartoscMa = wartoscMa;
    }

    public String getNumerWlasny() {
        return numerWlasny;
    }

    public void setNumerWlasny(String numerWlasny) {
        this.numerWlasny = numerWlasny;
    }

    public String getNumerObcy() {
        return numerObcy;
    }

    public void setNumerObcy(String numerObcy) {
        this.numerObcy = numerObcy;
    }

    public Date getDataZaksiegowania() {
        return dataZaksiegowania;
    }

    public void setDataZaksiegowania(Date dataZaksiegowania) {
        this.dataZaksiegowania = dataZaksiegowania;
    }

    public BigDecimal getWartosc() {
        return wartosc;
    }

    public void setWartosc(BigDecimal wartosc) {
        this.wartosc = wartosc;
    }

    public String getTresc() {
        return tresc;
    }

    public void setTresc(String tresc) {
        this.tresc = tresc;
    }
}
