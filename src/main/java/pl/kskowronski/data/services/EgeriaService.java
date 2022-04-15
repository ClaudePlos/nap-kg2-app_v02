package pl.kskowronski.data.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.kskowronski.data.entities.BalanceDTO;
import pl.kskowronski.data.entities.EatFirma;
import pl.kskowronski.data.entities.TransactionDTO;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;


@Service
public class EgeriaService {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void setConsolidateCompanyOnCompany(Integer frmId) {
        this.em.createNativeQuery("BEGIN eap_globals.USTAW_firme(" + frmId + "); eap_globals.USTAW_konsolidacje('N'); END;")
                .executeUpdate();
    }

    @Transactional
    public String copyAccountToAnotherCompany(Integer frmIdCompanyTo, String mask, String year, String level) {
        String ret = "Skopiowano " + mask +  " do : " + frmIdCompanyTo;
        /*
         --rok z którego kopiujemy
         --rok do którego kopiujemy
         --firma z której kopiujemy
         --firma do której kopiujemy
         -- poziom kont (ile analityk), w naprzodzie chyba max jest z 5 ale ustawiam na 20
         -- maska konta(syntetyka)
          -- maska kont, których nie chcemy przenosić
        * */
        String sql = "BEGIN mkp_obj_plany_kont.kopiuj(" + year + "," + year + ", 300326, " + frmIdCompanyTo + ", " + level + ", '" + mask + "','nie-ma-takiego'); END;";
        try {
            this.em.createNativeQuery(sql).executeUpdate();
        } catch (Exception e){
            ret = e.getMessage();
        }
        return ret;
    }


    @Transactional
    public List<BalanceDTO> calculateBalance(String frmName, String dateFrom, String dateTo, String mask) {
        String sql = "BEGIN kgp_nowe_ois.generuj (\n" +
                "    " +  dateFrom.substring(0,4) +",\n" +
                "    to_date('" + dateFrom +"','YYYY-MM-DD'),\n" +
                "    to_date('" + dateTo + "','YYYY-MM-DD'),\n" +
                "    '" + mask + "',\n" +
                "    999, --p_knt_max_poziom      IN  NUMBER,\n" +
                "    'B',\n" +
                "    1,\n" +
                "    'T',\n" + // weryfikacja
                "    'N',\n" + // pomin 0 saldo
                "    'T',\n" + // pomin niektywne
                "    '0',\n" +
                "     '999999',\n" +
                "    null,\n" +
                "    'N',\n" +
                "     'N',\n" +
                "    'N',\n" +
                "    'N'\n" +
                "  ); END;";
       // System.out.println(sql);
        this.em.createNativeQuery(sql).executeUpdate();

        String sql2 =
                "select * from (\n" +
                        "select knt_pelny_numer \"Konto\",\n" +
                        "       knt_nazwa \"Nazwa konta\",\n" +
                        "       wal_symbol \"Waluta\",\n" +
                        "RAP_BO_WN \"BO WN\",\n" +
                        "RAP_OBR_N_WN \"BO+Obroty nar WN\",\n" +
                        "RAP_BO_WN_WAL \"BO WN wal\",\n" +
                        "RAP_OBR_N_WN_WAL \"BO+Obroty nar WN wal\",\n" +
                        "RAP_BO_MA \"BO MA\", \n" +
                        "RAP_OBR_N_MA \"BO+Obroty nar MA\",\n" +
                        "RAP_BO_MA_WAL \"BO MA wal\",\n" +
                        "RAP_OBR_N_MA_WAL \"BO+Obroty nar MA wal\",\n" +
                        "RAP_OBR_WN \"Obroty okresu WN\",\n" +
                        "RAP_OBR_WN_WAL \"Obroty okresu WN wal\",\n" +
                        "RAP_OBR_MA \"Obroty okresu MA\", \n" +
                        "RAP_OBR_MA_WAL \"Obroty okresu MA wal\",\n" +
                        "RAP_SALDO_WN \"Saldo WN\",\n" +
                        "RAP_SALDO_WN_WAL \"Saldo WN wal\",\n" +
                        "RAP_SALDO_MA \"Saldo MA\",\n" +
                        "RAP_SALDO_MA_WAL \"Saldo MA wal\" \n" +
                        "from kgtt_rap46, kg_konta, css_waluty\n" +
                        "where knt_id = rap_knt_id\n" +
                        "and wal_id = nvl(rap_wal_id,1)\n" +
                        "order by knt_pelny_numer )";
        //System.out.println(sql2);
        List<Object[]> result = em.createNativeQuery(sql2).getResultList();

        List<BalanceDTO> balanceList = new ArrayList<>();
        result.forEach( item -> {
            BalanceDTO b = new BalanceDTO();
            b.setFrmName(frmName);
            b.setAccount((String) item[0]);
            b.setAccountName((String) item[1]);

            b.setBoWn((BigDecimal) item[3]);
            b.setBoMa((BigDecimal) item[7]);

            b.setBoWnPlusObrotyNar((BigDecimal) item[4]);
            b.setBoMaPlusObrotyNar((BigDecimal) item[8]);

            b.setObrotyWnNar(((BigDecimal) item[4]).subtract((BigDecimal) item[3]));
            b.setObrotyMaNar(((BigDecimal) item[8]).subtract((BigDecimal) item[7]));

            b.setObrotyOkresuWn((BigDecimal) item[11]);
            b.setObrotyOkresuMa((BigDecimal) item[13]);

            b.setSaldoWn((BigDecimal) item[15]);
            b.setSaldoMa((BigDecimal) item[17]);

            b.setPersaldo( ((BigDecimal) item[15]).subtract((BigDecimal) item[17]) );

            b.setCurrency((String) item[2]);

            balanceList.add(b);
        });

        return balanceList;
    }



    @Transactional
    public List<TransactionDTO> getTransactionsForAccountAndPeriod(Integer frmId, String dateFrom, String dateTo, String accountNumber) {

        setConsolidateCompanyOnCompany(frmId);

        String sql = "select frm_nazwa, knt_pelny_numer, ks_kwota, ks_tresc, dok_numer_wlasny, dok_data_zaksiegowania \n" +
                    ", (select knt_pelny_numer from kg_konta where knt_id = ks_knt_wn) konto_wn\n" +
                    ", (select knt_pelny_numer from kg_konta where knt_id = ks_knt_ma) konto_ma\n" +
                    ", case when ks_knt_wn is not null and (select knt_pelny_numer from kg_konta where knt_id = ks_knt_wn) like '" + accountNumber + "%' then ks_kwota else 0 end wn\n" +
                    ", case when ks_knt_ma is not null and (select knt_pelny_numer from kg_konta where knt_id = ks_knt_ma) like '" + accountNumber + "%' then -ks_kwota else 0 end ma\n" +
                    ", case when ks_knt_wn is not null and (select knt_pelny_numer from kg_konta where knt_id = ks_knt_wn) like '" + accountNumber + "%' then ks_kwota else 0 end \n" +
                    "+ case when ks_knt_ma is not null and (select knt_pelny_numer from kg_konta where knt_id = ks_knt_ma) like '" + accountNumber + "%' then -ks_kwota else 0 end saldo\n" +
                    "from kgt_ksiegowania, kgt_dokumenty, kg_konta, eat_firmy\n" +
                    "where ks_dok_id = dok_id \n" +
                    "and dok_frm_id = frm_id\n" +
                    "and dok_data_zaksiegowania between to_date('" + dateFrom + "','YYYY-MM-DD') and to_date('" + dateTo + "','YYYY-MM-DD') \n" +
                    "and (ks_knt_wn = knt_id or ks_knt_ma = knt_id) \n" +
                    "AND (ks_f_zaksiegowany = 'T' or ks_f_symulacja = 'T') \n" +
                    "--AND ks_rodzaj = 'PK' \n" +
                    "--and dok_numer_wlasny not like 'BO%' -- czy w styczniu z BO czy bez\n" +
                    "and knt_pelny_numer like '" + accountNumber + "%' \n" +
                    "order by frm_nazwa, dok_data_zaksiegowania  ";

        //System.out.println(sql2);
        List<Object[]> result = em.createNativeQuery(sql).getResultList();

        List<TransactionDTO> transactions = new ArrayList<>();
        result.forEach( item -> {
            TransactionDTO t = new TransactionDTO();
            t.setFrmName((String) item[0]);
            t.setAccount((String) item[1]);
            t.setWartosc((BigDecimal) item[2]);
            t.setTresc((String) item[3]);
            t.setNumerWlasny((String) item[4]);
            t.setDataZaksiegowania(((Timestamp) item[5]).toString().substring(0,10));
            t.setWartoscWn((BigDecimal) item[8]);
            t.setWartoscMa((BigDecimal) item[9]);
            transactions.add(t);
        });

        return transactions;
    }

}