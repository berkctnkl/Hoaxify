package com.example.demo.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;
@Data
@Entity
public class FileAttachment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Date createDate;
    @OneToOne
    private Hoax hoax;


}
