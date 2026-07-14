package com.email.dr.email.app;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;




@Service
public class EmailGeneratorService {

    private final WebClient webclient;

    @Value("${gemini.api.url}") 
    private String geminiapiurl;

    @Value("${gemini.api.key}")
    private String geminiapikey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webclient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest){


        String prompt= buildPrompt(emailRequest);

//Crafting req as per gemini format
        Map<String,Object> requestBody=Map.of(
        "contents" , new Object[]{
            Map.of("parts", new Object[]{
             Map.of("text", prompt)
        })
           
        }
    );

    // do req
    String response = webclient.post().uri(geminiapiurl + geminiapikey).header("Content-Type","application/json").bodyValue(requestBody).retrieve().bodyToMono(String.class).block();

    //return response
    return extractResponseContent(response);


    }

    private String extractResponseContent(String response) {
        try {
            ObjectMapper mapper =new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response);
            return rootNode.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();
            
        } catch (Exception e) {
            return "Error processing request: " + e.getMessage();
        }
    }

    private String buildPrompt(EmailRequest emailRequest) {
       
       StringBuilder prompt=new StringBuilder();
       prompt.append("Generate a Professional reply for the given email.Don't generate subject line and placeholder");
       if(emailRequest.getTone()!=null && !emailRequest.getTone().isEmpty()){
        prompt.append("Use a").append(emailRequest.getTone()).append("tone.");
       }
       prompt.append("\nOriginal email: \n").append(emailRequest.getEmailContent());
       return prompt.toString();
        
    }
}
