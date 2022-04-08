package pl.kskowronski.security;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import pl.kskowronski.data.entities.User;
import pl.kskowronski.data.services.UserRepo;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService
{

    private UserRepo userRepo;

    public MyUserDetailsService(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //BigDecimal.valueOf(Long.parseLong(username))
        Optional<User> user = userRepo.findByUsername(username);
        if (user.get() == null) {
            throw new UsernameNotFoundException("Could not find user with this username and pass");
        }

        return new MyUserDetails(user.get());
    }

}