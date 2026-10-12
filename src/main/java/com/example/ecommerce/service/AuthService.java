package com.example.ecommerce.service;

import com.example.ecommerce.entity.User;
import com.example.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.ecommerce.exception.EmailAlreadyExistsException;
import com.example.ecommerce.exception.InvalidCredentialsException;
import com.example.ecommerce.service.JwtService;
import com.example.ecommerce.dto.LoginResponse;


@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}

    public User signup(String name, String email, String password) {

        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException("Email already exists");
        }

       String hashedPassword = passwordEncoder.encode(password);

User user = new User(name, email, hashedPassword);

        return userRepository.save(user);
    }

    public LoginResponse login(String email, String password) {

    User user = userRepository.findByEmail(email)
            .orElseThrow(() ->
                    new InvalidCredentialsException(
                            "Invalid email or password"
                    ));

    if (!passwordEncoder.matches(password, user.getPassword())) {
        throw new InvalidCredentialsException(
                "Invalid email or password"
        );
    }

    
    String token = jwtService.generateToken(
        user.getEmail(),
        user.getRole()
);

    return new LoginResponse(
            token,
            user.getId(),
            user.getName(),
            user.getEmail()
    );
}
}