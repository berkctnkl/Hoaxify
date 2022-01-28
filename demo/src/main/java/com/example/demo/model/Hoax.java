package com.example.demo.model;

import lombok.Data;


import javax.persistence.*;
import javax.validation.constraints.Size;
import java.util.Date;

@Data
@Entity
public class Hoax {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Size(min = 1,max = 1000)
    @Column(length = 1000)
    private String content;
    private Date createDate;
    @ManyToOne
    private User user;
    @OneToOne(mappedBy = "hoax",cascade = CascadeType.REMOVE)
    private FileAttachment fileAttachment;
}
