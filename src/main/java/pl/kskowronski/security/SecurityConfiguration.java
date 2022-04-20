package pl.kskowronski.security;


import com.vaadin.flow.spring.security.VaadinWebSecurityConfigurerAdapter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.JwsAlgorithms;
import org.springframework.security.web.util.matcher.RequestMatcher;
import org.springframework.web.util.ServletRequestPathUtils;
import pl.kskowronski.data.services.UserRepo;

import javax.crypto.spec.SecretKeySpec;
import javax.servlet.http.HttpServletRequest;
import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.stream.Collectors;


@EnableWebSecurity
@Configuration
public class SecurityConfiguration extends VaadinWebSecurityConfigurerAdapter {


    public static String ROLE_ADMIN = "admin";

    @Value("${springSecurityTestApp.security.stateless:false}")
    private boolean stateless;


    @Bean
    public PasswordEncoder passwordEncoder() {
        return new PasswordEncoder() {
            @Override
            public String encode(CharSequence charSequence) {
                return getMd5(charSequence.toString());
            }

            @Override
            public boolean matches(CharSequence charSequence, String s) {
                return getMd5(charSequence.toString()).equals(s);
            }
        };
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
          //super.configure(http);
         // setLoginView(http, "/login");

        // Public access
        http.authorizeRequests().antMatchers(applyUrlMapping("/login")).permitAll();
        http.authorizeRequests().antMatchers(applyUrlMapping("/form")).permitAll();
        // Admin only access
        http.authorizeRequests().antMatchers("/admin-only/**")
                .hasAnyRole(ROLE_ADMIN);

        super.configure(http);
        setLoginView(http, "/login");

        //http.logout().logoutUrl(applyUrlMapping("/logout"));

        if (stateless) {
            setStatelessAuthentication(http,
                    new SecretKeySpec(Base64.getUrlDecoder().decode(
                            "I72kIcB1UrUQVHVUAzgweE-BLc0bF8mLv9SmrgKsQAk"),
                            JwsAlgorithms.HS256),
                    "statelessapp");
        }

    }

    @Autowired
    private UserDetailsService userDetailsService;

    @Autowired
    private UserRepo userRepo;

    @Bean
    public AuthenticationProvider authProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }


    @Override
    protected void configure(AuthenticationManagerBuilder auth)
            throws Exception {
        auth.userDetailsService(username -> {
            pl.kskowronski.data.entities.User userInfo = userRepo.findByUsername(username).get();
            if (userInfo == null) {
                throw new UsernameNotFoundException(
                        "No user present with username: " + username);
            } else {
                return new User(userInfo.getUsername(),
                        userInfo.getPassword(),
                        userInfo.getRoles().stream()
                                .map(role -> new SimpleGrantedAuthority(
                                        "ROLE_" + role))
                                .collect(Collectors.toList()));
            }
        });
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        super.configure(web);
        web.ignoring().antMatchers("/images/**");
    }

    public static String getMd5(String input) {
        try {
            // Static getInstance method is called with hashing SHA
            MessageDigest md = MessageDigest.getInstance("MD5");

            // digest() method called
            // to calculate message digest of an input
            // and return array of byte
            byte[] messageDigest = md.digest(input.getBytes());

            // Convert byte array into signum representation
            BigInteger no = new BigInteger(1, messageDigest);

            // Convert message digest into hex value
            String hashtext = no.toString(16);

            while (hashtext.length() < 32) {
                hashtext = "0" + hashtext;
            }

            return hashtext;
        }

        // For specifying wrong message digest algorithms
        catch (NoSuchAlgorithmException e) {
            System.out.println("Exception thrown"
                    + " for incorrect algorithm: " + e);
            return null;
        }
    }

}
