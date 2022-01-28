package com.example.demo;




import com.example.demo.dto.CreateUserRequest;
import com.example.demo.model.Hoax;
import com.example.demo.model.User;
import com.example.demo.repository.HoaxRepository;
import com.example.demo.repository.UserRepository;

import com.example.demo.service.UserService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;

import java.util.Date;

@SpringBootApplication()
@ComponentScan
public class DemoApplication {

	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	CommandLineRunner initializeUsers(UserService userService, HoaxRepository hoaxRepository){
		return new CommandLineRunner() {
			@Override
			public void run(String... args) throws Exception {
				try{
					userService.findByUsername("user1");
				}catch (Exception e){
					for(int i=1;i<=25;i++){
						CreateUserRequest user=new CreateUserRequest();
						user.setUsername("user"+i);
						user.setDisplayName("display"+i);
						user.setPassword("P4ssword");
						User inDB=userService.save(user);
						for(int j=1;j<=20;j++){
							Hoax hoax=new Hoax();
							hoax.setContent("Hoax-"+j+" from user "+i);
							hoax.setUser(inDB);
							hoax.setCreateDate(new Date());
							hoaxRepository.save(hoax);
						}
					}
				}




			}
		};
	}

}
