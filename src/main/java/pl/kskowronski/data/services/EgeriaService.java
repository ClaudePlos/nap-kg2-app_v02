package pl.kskowronski.data.services;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import pl.kskowronski.data.entities.BalanceDTO;
import pl.kskowronski.data.entities.TransactionDTO;
import pl.kskowronski.data.entities.MovementDTO;


import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;


@Service
public class EgeriaService {

    @PersistenceContext
    private EntityManager em;

    @Transactional
    public void setConsolidateCompany() {
        this.em.createNativeQuery("BEGIN eap_globals.USTAW_konsolidacje('T'); END;")
                //.setParameter("inParam1", inParam1)
                .executeUpdate();
    }

    @Transactional
    public void setConsolidateCompanyOnCompany(Integer frmId) {
        this.em.createNativeQuery("BEGIN eap_globals.USTAW_firme(" + frmId + "); eap_globals.USTAW_konsolidacje('N'); END;")
                .executeUpdate();
    }

    @Transactional
    public String copyAccountToAnotherCompany(Integer frmIdCompanyTo, String mask, String year, String level, String frmName) {
        setConsolidateCompany();
        String ret = "Skopiowano " + mask +  " do : " + frmName;
        /*
         --rok z którego kopiujemy
         --rok do którego kopiujemy
         --firma z której kopiujemy
         --firma do której kopiujemy
         -- poziom kont (ile analityk), w naprzodzie chyba max jest z 5 ale ustawiam na 20
         -- maska konta(syntetyka)
          -- maska kont, których nie chcemy przenosić
        * */
        String sql = "BEGIN mkp_obj_plany_kont.kopiuj(" + year + ", " + year + ", 300326, " + frmIdCompanyTo + ", '" + level  + "', '" + mask + "','nie-ma-takiego'); END;";
        try {
            this.em.createNativeQuery(sql).executeUpdate();
        } catch (Exception e){
            ret = e.getMessage();
        }
        return ret;
    }


    @Transactional
    public List<BalanceDTO> calculateBalance(String frmName, String dateFrom, String dateTo, String mask, String lowestLevel) {
        String typRaportu = "1";

        if ( lowestLevel.equals("T") ) {
            typRaportu = "3";
        }

        String sql = "BEGIN kgp_nowe_ois.generuj (\n" +
                "    " +  dateFrom.substring(0,4) +",\n" +
                "    to_date('" + dateFrom +"','YYYY-MM-DD'),\n" +
                "    to_date('" + dateTo + "','YYYY-MM-DD'),\n" +
                "    '" + mask + "',\n" +
                "    999, --p_knt_max_poziom      IN  NUMBER,\n" +
                "    'B',\n" +
                "    " +typRaportu + ",\n" +
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

    @Transactional
    public List<MovementDTO> calculateMovements(String dateFrom, String dateTo, String mask) {
        String sql = "select firma, knt_pelny_numer,knt_nazwa\n" +
                ", sum(a) A,sum(b)  B,sum(C)C,sum(D)  D,\n" +
                " sum(E) E,sum(F) F\n" +
                " from (\n" +
                "select firma, knt_pelny_numer,knt_nazwa,sum(kwota)a ,0 b,0 C, 0 D,0 E, 0 F from (\n" +
                "select frm_nazwa firma,knt_pelny_numer,  sum(ks_kwota) kwota,knt_nazwa\n" +
                " from kgt_dokumenty,kgt_ksiegowania,kg_konta,eat_firmy\n" +
                "where dok_id=ks_dok_id\n" +
                "and dok_frm_Id=frm_id\n" +
                "and knt_id=ks_knt_wn\n" +
                "and knt_pelny_numer like '" + mask + "'\n" +
                "and KNT_TYP='B'\n" +
                "and dok_numer_wlasny  like 'BO%'\n" +
                "AND( dok_F_SYMULACJA='T' or dok_f_zaksiegowany ='T')\n" +
                "and to_Char(dok_data_zaksiegowania,'yyyy')='" + dateTo.substring(0,4) + "'\n" +
                "group by frm_nazwa,dok_data_zaksiegowania,knt_pelny_numer,knt_nazwa\n" +
                ") \n" +
                "group by firma, knt_pelny_numer,knt_nazwa\n" +
                " union all\n" +
                " select firma,  knt_pelny_numer,knt_nazwa,0 a,sum(kwota)  b,0 C, 0 D,0 E, 0 F from (\n" +
                "select frm_nazwa firma,knt_pelny_numer,  sum(ks_kwota) kwota,knt_nazwa\n" +
                " from kgt_dokumenty,kgt_ksiegowania,kg_konta,eat_firmy\n" +
                "where dok_id=ks_dok_id\n" +
                "and dok_frm_Id=frm_id\n" +
                "and knt_id=ks_knt_ma\n" +
                "and knt_pelny_numer like  '" + mask + "'\n" +
                "and KNT_TYP='B'\n" +
                "and dok_numer_wlasny  like 'BO%'\n" +
                "AND( dok_F_SYMULACJA='T' or dok_f_zaksiegowany ='T')\n" +
                "and to_Char(dok_data_zaksiegowania,'yyyy')='" + dateTo.substring(0,4) + "'\n" +
                "group by frm_nazwa,dok_data_zaksiegowania,knt_pelny_numer,knt_nazwa\n" +
                ") \n" +
                "group by firma, knt_pelny_numer,knt_nazwa\n" +
                "union all\n" +
                " select firma,  knt_pelny_numer,knt_nazwa,0 a, 0 b, sum(kwota)  C, 0 D,0 E, 0 F from (\n" +
                "select frm_nazwa firma,knt_pelny_numer,  sum(ks_kwota) kwota,knt_nazwa\n" +
                " from kgt_dokumenty,kgt_ksiegowania,kg_konta,eat_firmy\n" +
                "where dok_id=ks_dok_id\n" +
                "and dok_frm_Id=frm_id\n" +
                "and knt_id=ks_knt_WN\n" +
                "and knt_pelny_numer like  '" + mask + "'\n" +
                "and KNT_TYP='B'\n" +
                "and dok_numer_wlasny not like 'BO%'\n" +
                "AND( dok_F_SYMULACJA='T' or dok_f_zaksiegowany ='T')\n" +
                "and dok_data_zaksiegowania >= to_date('" + dateFrom + "','YYYY-MM-DD')\n" +
                "and dok_data_zaksiegowania <= to_date('" + dateTo + "','YYYY-MM-DD')\n" +
                "group by frm_nazwa,dok_data_zaksiegowania,knt_pelny_numer,knt_nazwa\n" +
                ") \n" +
                "group by firma,knt_pelny_numer,knt_nazwa\n" +
                "union all\n" +
                "select firma, knt_pelny_numer,knt_nazwa,0 a,0 b,0 c,sum(kwota)   D,0 E, 0 F from (\n" +
                "select frm_nazwa firma,knt_pelny_numer,  sum(ks_kwota) kwota,knt_nazwa\n" +
                " from kgt_dokumenty,kgt_ksiegowania,kg_konta,eat_firmy\n" +
                "where dok_id=ks_dok_id\n" +
                "and dok_frm_Id=frm_id\n" +
                "and knt_id=ks_knt_ma\n" +
                "and knt_pelny_numer like  '" + mask + "'\n" +
                "and KNT_TYP='B'\n" +
                "and dok_numer_wlasny not like 'BO%'\n" +
                "AND( dok_F_SYMULACJA='T' or dok_f_zaksiegowany ='T')\n" +
                "and dok_data_zaksiegowania>= to_date('" + dateFrom + "','YYYY-MM-DD')\n" +
                "and dok_data_zaksiegowania<= to_date('" + dateTo + "','YYYY-MM-DD')\n" +
                "group by frm_nazwa,dok_data_zaksiegowania,knt_pelny_numer,knt_nazwa\n" +
                ") \n" +
                "group by firma, knt_pelny_numer,knt_nazwa\n" +
                "union all\n" +
                "select firma,  knt_pelny_numer,knt_nazwa,0 a,0 b,0 c,0 d,sum(kwota)    E, 0 F from (\n" +
                "select frm_nazwa firma,knt_pelny_numer,  sum(ks_kwota) kwota,knt_nazwa\n" +
                " from kgt_dokumenty,kgt_ksiegowania,kg_konta,eat_firmy\n" +
                "where dok_id=ks_dok_id\n" +
                "and dok_frm_Id=frm_id\n" +
                "and knt_id=ks_knt_wn\n" +
                "and knt_pelny_numer like  '" + mask + "'\n" +
                "and KNT_TYP='B'\n" +
                "AND( dok_F_SYMULACJA='T' or dok_f_zaksiegowany ='T')\n" +
                "and dok_data_zaksiegowania<= to_date('" + dateTo + "','YYYY-MM-DD')\n" +
                "and to_char(dok_data_zaksiegowania,'yyyy')= '" + dateTo.substring(0,4) + "'\n" +
                "group by frm_nazwa,knt_pelny_numer,knt_nazwa\n" +
                ") \n" +
                "group by firma,knt_pelny_numer,knt_nazwa\n" +
                "union all\n" +
                "select firma, knt_pelny_numer,knt_nazwa,0 a,0 b,0 c,0 d,0 E,sum(kwota)    F from (\n" +
                "select frm_nazwa firma,knt_pelny_numer,  sum(ks_kwota) kwota,knt_nazwa\n" +
                " from kgt_dokumenty,kgt_ksiegowania,kg_konta,eat_firmy\n" +
                "where dok_id=ks_dok_id\n" +
                "and dok_frm_Id=frm_id\n" +
                "and knt_id=ks_knt_ma\n" +
                "and knt_pelny_numer like  '" + mask + "'\n" +
                "and KNT_TYP='B'\n" +
                "AND( dok_F_SYMULACJA='T' or dok_f_zaksiegowany ='T')\n" +
                "and dok_data_zaksiegowania<= to_date('" + dateTo + "','YYYY-MM-DD')\n" +
                "and to_char(dok_data_zaksiegowania,'yyyy')= '" + dateTo.substring(0,4) + "'\n" +
                "group by frm_nazwa,knt_pelny_numer,knt_nazwa\n" +
                ") \n" +
                "group by firma, knt_pelny_numer,knt_nazwa\n" +
                ")GROUP BY firma, knt_pelny_numer,knt_nazwa order by firma, knt_pelny_numer";
        // System.out.println(sql);
        this.em.createNativeQuery(sql).executeUpdate();


        List<Object[]> result = em.createNativeQuery(sql).getResultList();

        List<MovementDTO> turnoverList = new ArrayList<>();
        result.forEach( item -> {
            MovementDTO t = new MovementDTO();
            t.setFrmName((String) item[0]);
            t.setAccount((String) item[1]);
            t.setAccountName((String) item[2]);
            t.setBoWn((BigDecimal) item[3]);
            t.setBoMa((BigDecimal) item[4]);
            t.setObrotyWn((BigDecimal) item[5]);
            t.setObrotyMa((BigDecimal) item[6]);
            t.setObrotyWnNarPlusBO((BigDecimal) item[7]);
            t.setObrotyMaNarPlusBO((BigDecimal) item[8]);
//            t.setSaldoWn(t.getObrotyWn().add(t.getBoWn())
//                    .subtract(t.getObrotyMa().add(t.getBoMa().add(t.getBoMa()))).compareTo(BigDecimal.ZERO) >= 0 ?
//                        t.getObrotyWn().add(t.getBoWn()).subtract(t.getObrotyMa().add(t.getBoMa())) : BigDecimal.ZERO);
//            t.setSaldoMa(t.getObrotyMa().add(t.getBoMa())
//                    .subtract(t.getObrotyWn().add(t.getBoWn())).compareTo(BigDecimal.ZERO) >= 0 ?
//                        t.getObrotyMa().add(t.getBoMa()).subtract(t.getObrotyWn().add(t.getBoMa())) : BigDecimal.ZERO);
            t.setSaldoWn( t.getObrotyWnNarPlusBO().subtract(t.getObrotyMaNarPlusBO()).compareTo(BigDecimal.ZERO) >= 0 ?
                    t.getObrotyWnNarPlusBO().subtract(t.getObrotyMaNarPlusBO()) : BigDecimal.ZERO
            );
            t.setSaldoMa( t.getObrotyMaNarPlusBO().subtract(t.getObrotyWnNarPlusBO()).compareTo(BigDecimal.ZERO) >= 0 ?
                    t.getObrotyMaNarPlusBO().subtract(t.getObrotyWnNarPlusBO()) : BigDecimal.ZERO
            );
            turnoverList.add(t);
        });

        return turnoverList;
    }



}