package com.example.demo.service;

import com.example.demo.configuration.AppConfiguration;
import com.example.demo.model.FileAttachment;
import com.example.demo.model.Hoax;
import com.example.demo.model.User;
import com.example.demo.repository.FileAttachmentRepository;
import org.apache.tika.Tika;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Base64;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@EnableScheduling
public class FileService {
private final AppConfiguration appConfiguration;
private final FileAttachmentRepository fileAttachmentRepository;
public FileService(AppConfiguration appConfiguration, FileAttachmentRepository fileAttachmentRepository){
    this.appConfiguration=appConfiguration;
    this.fileAttachmentRepository = fileAttachmentRepository;
}


public String writeBase64EncodedStringToFile(String image) throws IOException {
    String fileName=getRandomName();
    File target=new File(appConfiguration.getUploadPath()+fileName);
    FileOutputStream outputStream=new FileOutputStream(target);
    byte[] base64Decoded=Base64.getDecoder().decode(image);
    outputStream.write(base64Decoded);
    outputStream.close();
    return fileName;
}

private String getRandomName(){
    return UUID.randomUUID().toString().replaceAll("-","");
}


    public void deleteOldFile(String oldImageName) {
    if(oldImageName==null){
        return;
    }
    String filePath=appConfiguration.getUploadPath()+oldImageName;
        try {
            Files.deleteIfExists(Paths.get(filePath));
        } catch (IOException e) {
            e.printStackTrace();
        }

    }

    public FileAttachment getFileAttachmentById (Long id){
    return fileAttachmentRepository.getById(id);
    }

    public void saveFileAttachment(FileAttachment fileAttachment){
    fileAttachmentRepository.save(fileAttachment);
    }

    public String detectType(String value){
        Tika tika=new Tika();
        byte[] base64Decoded=Base64.getDecoder().decode(value);
        return tika.detect(base64Decoded);
    }

    public FileAttachment saveHoaxAttachment(MultipartFile file){
        String fileName=getRandomName();
        File target=new File(appConfiguration.getUploadPath()+fileName);
        FileOutputStream outputStream= null;
        try {
            outputStream = new FileOutputStream(target);
            outputStream.write(file.getBytes());
            outputStream.close();

        } catch (IOException e) {
            e.printStackTrace();
        }
        FileAttachment fileAttachment=new FileAttachment();
        fileAttachment.setName(fileName);
        fileAttachment.setCreateDate(new Date());

        return fileAttachmentRepository.save(fileAttachment);
    }

    @Scheduled(fixedRate = 24*60*60*1000)
    public void cleanUpFileAttachments(){
    List<FileAttachment> fileAttachments= fileAttachmentRepository
            .findByCreateDateBeforeAndHoaxIsNull(new Date(System.currentTimeMillis()-24*60*60*1000));
    fileAttachments.forEach(fileAttachment -> {deleteOldFile(fileAttachment.getName());
                                                    fileAttachmentRepository.deleteById(fileAttachment.getId());});
    }

    public void deleteFilesForUser(User user) {
    deleteOldFile(user.getImage());
    List<FileAttachment> fileAttachments=user.getHoaxes().stream().map(Hoax::getFileAttachment).collect(Collectors.toList());
    fileAttachments.forEach(t->
            {if(t!=null)
                deleteOldFile(t.getName());
            }
    );
}
}
