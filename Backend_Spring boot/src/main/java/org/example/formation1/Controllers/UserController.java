package org.example.formation1.Controllers;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import jakarta.websocket.server.PathParam;
import org.example.formation1.Models.RefreshTokenmodel;
import org.example.formation1.Models.UserModel;
import org.example.formation1.Repositories.UserRepository;
import org.example.formation1.Services.StorageService;
import org.example.formation1.Services.UserService;
import org.example.formation1.payload.JwtResponse;
import org.example.formation1.payload.LoginRequest;
import org.example.formation1.payload.MessageResponse;
import org.example.formation1.security.jwt.JwtUtils;
import org.example.formation1.security.services.RefreshTokenService;
import org.example.formation1.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.GrantedAuthority;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/user")
@CrossOrigin("*")
public class UserController {

    @Autowired
    UserService userService;
    @Autowired
    StorageService storageService;
    @Autowired
    UserRepository userRepo;
    @Autowired
    JavaMailSender mailSender;
    @Autowired
    PasswordEncoder encoder;
    @Autowired
    AuthenticationManager authenticationManager;
    @Autowired
    JwtUtils jwtUtils;
    @Autowired
    RefreshTokenService refreshTokenService;


    @PostMapping("/create")
    public UserModel create(UserModel user, @PathParam("file") MultipartFile file) throws MessagingException {
        String namephoto=storageService.store(file);
        user.setPhoto(namephoto);
        user.setPassword(encoder.encode(user.getPassword()));
        //création de user

        UserModel CreatedUser=userRepo.save(user);
        ///send mail

        String from ="admin@gmail.com";
        String to=user.getEmail();
        String subject="sucess to create account";
        String content="Welcome  "+user.getFirstName()+ "  ";

        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper messageHelper=new MimeMessageHelper(message);
        messageHelper.setFrom(from);
        messageHelper.setTo(to);
        messageHelper.setSubject(subject);
        messageHelper.setText("<html><body>"+content+" <br><a href = http://localhost:8083/user/confirm?email="+user.getEmail()+"> verify</br></body></html>",true);
        mailSender.send(message);

        //mise à jour et return de fonction

        return  userRepo.save(CreatedUser);
    }

    @GetMapping("/list")
    public List<UserModel> getList() {
        return userService.getAllUsers();
    }

    @GetMapping("/getOne/{id}")
    public UserModel getOne(@PathVariable Long id) {
        return userService.getUserById(id);
    }

    @PutMapping("/update/{id}")
    public UserModel update(
            @ModelAttribute UserModel user,
            @RequestParam(value = "file", required = false) MultipartFile file,
            @PathVariable Long id
    ) {
        user.setId(id);
        UserModel old = userService.getUserById(id);

        if (file == null || file.isEmpty()) {
            user.setPhoto(old.getPhoto());
        } else {
            String namephoto = storageService.store(file);
            user.setPhoto(namephoto);
        }

        if (user.getFirstName() == null) user.setFirstName(old.getFirstName());
        if (user.getLastName() == null) user.setLastName(old.getLastName());
        if (user.getEmail() == null) user.setEmail(old.getEmail());
        if (user.getPassword() == null) user.setPassword(old.getPassword());
        if (user.getPhone() == null) user.setPhone(old.getPhone());
        if (user.getUsername() == null) user.setUsername(old.getUsername());
        if (user.getRole() == null) user.setRole(old.getRole());
        if (user.getConfirm() == null) user.setConfirm(old.getConfirm());

        return userService.updateUser(user);
    }


    @DeleteMapping("/delete/{id}")
    public String delete(@PathVariable Long id) {
        userService.deleteUser(id);
        return "Delete success";
    }

    @GetMapping("/signout")
    public ResponseEntity<?> logoutUser(){
        UserDetailsImpl userDetails = (UserDetailsImpl) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Long userId = userDetails.getId();
        refreshTokenService.deleteByUserId(userId);
        return ResponseEntity.ok(new MessageResponse("log out successful"));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(LoginRequest loginRequest){
        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(),loginRequest.getPassword()));
        System.out.println("***step 1*****");
        Optional<UserModel> u=userRepo.findByUsername(loginRequest.getUsername());
        System.out.println("***step 2*****");
        if (u.get().getConfirm()==true){
            SecurityContextHolder.getContext().setAuthentication(authentication);
            System.out.println("***step 3*****");
            UserDetailsImpl userDetails=(UserDetailsImpl) authentication.getPrincipal();
            System.out.println("***step 4*****");
            String jwt=jwtUtils.generateJwtToken(userDetails);
            System.out.println("***step 5*****");
            RefreshTokenmodel refreshToken = refreshTokenService.createRefreshToken(userDetails.getId());
            System.out.println("***step 6*****");
            return ResponseEntity.ok(
                    new JwtResponse(jwt,
                            "bearer",
                            refreshToken.getToken(),
                            userDetails.getId(),
                            userDetails.getUsername(),
                            userDetails.getEmail(),
                            u.get().getRole()
                            // roles.get(0)
                    )
            )
                    ;
        }else {
            throw new RuntimeException("user not confirmed");
        }
    }
    @GetMapping("/confirm")
    public ResponseEntity<?> confirm (@RequestParam String email){
        UserModel user =userRepo.findFirstByEmail(email);
        user.setConfirm(true);
        userRepo.save(user);
        return ResponseEntity.ok("is confim");
    }
    @GetMapping("/files/{filename:.+}")
    @ResponseBody
    public ResponseEntity<Resource> getFile(@PathVariable String filename) {
        Resource file = storageService.loadFile(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                .body(file);
    }
}
