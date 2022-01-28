package com.example.demo.controller;

import com.example.demo.annotation.CurrentUserDetails;
import com.example.demo.dto.HoaxDto;
import com.example.demo.dto.HoaxSubmitRequest;
import com.example.demo.exception.ApiException;
import com.example.demo.model.User;
import com.example.demo.service.HoaxService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/1.0/hoaxes")
public class HoaxController {
private final HoaxService hoaxService;

public HoaxController(HoaxService hoaxService) {
        this.hoaxService = hoaxService;
}
    @PostMapping
    public ResponseEntity<?> save(@Valid @RequestBody HoaxSubmitRequest hoaxSubmitRequest, @CurrentUserDetails User currentUserDetails) {;
        hoaxService.save(hoaxSubmitRequest, currentUserDetails);

        return ResponseEntity.ok().body("Hoax saved");
    }

    @GetMapping
    public Page<HoaxDto> getAllHoaxes(@PageableDefault(sort = "id",direction = Sort.Direction.DESC) Pageable page){
         return hoaxService.getAllHoaxes(page).map(HoaxDto::converter);
    }

    @GetMapping("/{id:[0-9]+}")
    public ResponseEntity<?> getHoaxesRelative(@PageableDefault(sort = "id",direction = Sort.Direction.DESC) Pageable page
    ,@PathVariable Long id, @RequestParam(name = "count",required = false, defaultValue = "false") boolean count
    ,@RequestParam(name="direction",required = false,defaultValue = "before") String direction){
        if(count){
            long newHoaxCount=hoaxService.getNewHoaxesCount(id);
            Map<String,Long> response=new HashMap<>();
            response.put("count",newHoaxCount);
            return ResponseEntity.ok(response);
        }
        if(direction.equals("after")){
            List<HoaxDto> newHoaxes=hoaxService.getNewHoaxes(id,page.getSort()).stream().
                    map(HoaxDto::converter).collect(Collectors.toList());
            return ResponseEntity.ok(newHoaxes);
        }
        return ResponseEntity.ok(hoaxService.getOldHoaxes(id,page).map(HoaxDto::converter));

    }

    @DeleteMapping("/{id:[0-9]+}")
    @PreAuthorize("@hoaxSecurityService.isAllowedToDelete(#id,principal)")
    public ResponseEntity<?> deleteHoax(@PathVariable Long id){


        hoaxService.deleteHoax(id);
        return ResponseEntity.ok("Hoax removed");
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ApiException validationExceptionHandler(MethodArgumentNotValidException ex){
        ApiException exception=new ApiException(400,"Validation Exception","api/1.0/hoaxes");
        Map<String,String> validationExceptions=new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(t->validationExceptions.put(t.getField(),t.getDefaultMessage()));
        exception.setValidationExceptions(validationExceptions);
        return exception;
    }




}
