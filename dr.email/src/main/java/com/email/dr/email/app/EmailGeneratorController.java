package com.email.dr.email.app;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@RestController
@RequestMapping("/api/email")
@AllArgsConstructor
@CrossOrigin(origins="*")
public class EmailGeneratorController {

    private final EmailGeneratorService emailgeneratorservice;


    @PostMapping("/generate")
    public ResponseEntity<String> generate(@RequestBody EmailRequest emailRequest){
        String response = emailgeneratorservice.generateEmailReply(emailRequest);
        return ResponseEntity.ok(response); 
    }

}
