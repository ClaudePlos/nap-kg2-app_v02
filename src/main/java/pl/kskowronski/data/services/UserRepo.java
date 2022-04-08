package pl.kskowronski.data.services;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Component;
import pl.kskowronski.data.entities.User;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

public interface UserRepo extends JpaRepository<User, BigDecimal> {

    Optional<User> findById(BigDecimal prcId);

    Optional<User> findByUsername(String username);

    Optional<User> findByPassword(String pesel);

    @Query("select u from User u where u.username like %:word%")
    Optional<List<User>> findFastUsers(@Param("word") String word);

}