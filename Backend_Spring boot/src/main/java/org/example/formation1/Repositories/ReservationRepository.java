package org.example.formation1.Repositories;

import org.example.formation1.Models.ReservationModel;
import org.example.formation1.Models.UserModel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface ReservationRepository extends JpaRepository<ReservationModel, Long> {
    ReservationModel findFirstByUser(UserModel user);

}
