package com.example.demo.repository;

import com.example.demo.model.FileAttachment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Date;
import java.util.List;

public interface FileAttachmentRepository extends JpaRepository<FileAttachment,Long> {
List<FileAttachment> findByCreateDateBeforeAndHoaxIsNull(Date date);

}
