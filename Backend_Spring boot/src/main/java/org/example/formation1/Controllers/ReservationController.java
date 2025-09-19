package org.example.formation1.Controllers;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.example.formation1.Models.ReservationModel;
import org.example.formation1.Models.UserModel;
import org.example.formation1.Repositories.ReservationRepository;
import org.example.formation1.Repositories.UserRepository;
import org.example.formation1.Services.ReservationService;
import org.example.formation1.Services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;

@RestController
@RequestMapping("/reservation")
@CrossOrigin("*")
public class ReservationController {

    @Autowired
    ReservationService reservationService;

    @Autowired
    UserService userService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    JavaMailSender mailSender;

    // ✅ Création de réservation + envoi email
    @PostMapping("/create/{userId}")
    public ReservationModel create(@ModelAttribute ReservationModel reservation, @PathVariable Long userId)
            throws MessagingException, UnsupportedEncodingException {

        UserModel user = userService.getUserById(userId);
        reservation.setUser(user); // ✅ Correction ici
        reservation.setPaid(false);
        reservation.setConfirm(false);

        ReservationModel createdReservation = reservationRepository.save(reservation);

        // --- Envoi d'email avec lien de confirmation
        String from = "admin@gmail.com";
        String to = user.getEmail();
        String subject = "Success: Reservation Created";
        String content = "Your reservation has been successfully created.";
        String encodedEmail = URLEncoder.encode(to, StandardCharsets.UTF_8.toString());

        String htmlContent = "<html><body>" +
                content + "<br/>" +
                "<a href=\"http://localhost:8083/reservation/confirm?email=" + encodedEmail + "\">Click here to confirm</a>" +
                "</body></html>";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);
        helper.setFrom(from);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);

        mailSender.send(message);

        return createdReservation;
    }

    // ✅ Lors du clic sur le lien => paid + confirm = true
    @GetMapping("/confirm")
    public ResponseEntity<?> confirm(@RequestParam String email) {
        UserModel user = userRepository.findFirstByEmail(email);
        if (user == null) {
            return ResponseEntity.badRequest().body("Utilisateur introuvable.");
        }

        ReservationModel reservation = reservationRepository.findFirstByUser(user);
        if (reservation == null) {
            return ResponseEntity.badRequest().body("Réservation introuvable.");
        }

        reservation.setPaid(true);
        reservation.setConfirm(true);
        reservationRepository.save(reservation);

        return ResponseEntity.ok("✅ Votre réservation est confirmée.");
    }

    @GetMapping("/list")
    public List<ReservationModel> getlist() {
        return reservationService.getAllReservations();
    }

    @GetMapping("/getOne/{id}")
    public ReservationModel getOne(@PathVariable Long id) {
        return reservationService.getOneReservation(id);
    }

    @PutMapping("/update/{id}")
    public ReservationModel update(ReservationModel reservationModel, @PathVariable Long id) {
        reservationModel.setId(id);
        ReservationModel old = reservationService.getOneReservation(id);

        if (reservationModel.getDate() == null) {
            reservationModel.setDate(old.getDate());
        }

        if (reservationModel.getPaid() == null || !reservationModel.getPaid()) {
            reservationModel.setPaid(old.getPaid());
        }

        return reservationService.updateReservation(reservationModel);
    }

    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        reservationService.DeleteReservation(id);
        return "Delete success";
    }
}
