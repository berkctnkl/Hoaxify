package com.example.demo.service;

import com.example.demo.dto.HoaxSubmitRequest;
import com.example.demo.model.FileAttachment;
import com.example.demo.model.Hoax;
import com.example.demo.model.User;
import com.example.demo.repository.HoaxRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;
import java.util.Date;
import java.util.List;

@Service
public class HoaxService {
private final HoaxRepository hoaxRepository;
private final FileService fileService;

    public HoaxService(HoaxRepository hoaxRepository, FileService fileService) {
        this.hoaxRepository = hoaxRepository;
        this.fileService = fileService;
    }


    public void save(HoaxSubmitRequest hoaxSubmitRequest, User user) {
        Hoax hoax=new Hoax();
        hoax.setContent(hoaxSubmitRequest.getContent());
        hoax.setUser(user);
        hoax.setCreateDate(new Date());
        Hoax inDB=hoaxRepository.save(hoax);
        FileAttachment fileAttachment=fileService.getFileAttachmentById(hoaxSubmitRequest.getAttachmentId());
        if(fileAttachment!=null){
            fileAttachment.setHoax(inDB);
            fileService.saveFileAttachment(fileAttachment);
        }
    }

    public Page<Hoax> getAllHoaxes(Pageable page) {
     return hoaxRepository.findAll(page);
    }

    public Page<Hoax> getUserHoaxes(Pageable page, User user) {
        return hoaxRepository.findByUser(page,user);
    }

    public Page<Hoax> getOldHoaxes(Long id, Pageable page) {
        Specification<Hoax> spec=idLessThan(id);
        return hoaxRepository.findAll(spec, page);

    }

    public Page<Hoax> getOldUserHoaxes(Pageable page,Long id,User user) {
        Specification<Hoax> spec=idLessThan(id);
        spec=spec.and(userIs(user));
        return hoaxRepository.findAll(spec,page);
    }

    public long getNewHoaxesCount(long id) {
        Specification<Hoax> spec=idGreaterThan(id);
        return hoaxRepository.count(spec);
    }

    public long getUserNewHoaxesCount(User user, Long id) {
        Specification<Hoax> spec=idGreaterThan(id);
        spec=spec.and(userIs(user));
        return hoaxRepository.count(spec);
    }

    public List<Hoax> getNewHoaxes(Long id, Sort sort) {
        Specification<Hoax> spec=idGreaterThan(id);
        return hoaxRepository.findAll(spec,sort);
    }

    public List<Hoax> getNewUserHoaxes(Long id,User user, Sort sort) {
        Specification<Hoax> spec=idGreaterThan(id);
        spec=spec.and(userIs(user));
        return hoaxRepository.findAll(spec,sort);}

    Specification<Hoax> idGreaterThan(long id){
        return new Specification<Hoax>() {
            @Override
            public Predicate toPredicate(Root<Hoax> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.greaterThan(root.get("id"),id);
            }
        };
    }

    Specification<Hoax>  idLessThan(long id){
        return new Specification<Hoax>() {
            @Override
            public Predicate toPredicate(Root<Hoax> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.lessThan(root.get("id"),id);
            }
        };
    }

    Specification<Hoax> userIs(User user){
        return new Specification<Hoax>() {
            @Override
            public Predicate toPredicate(Root<Hoax> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
                return criteriaBuilder.equal(root.get("user"),user);
            }
        };
    }


    public void deleteHoax(Long id) {
        Hoax hoax=hoaxRepository.getById(id);
        if(hoax.getFileAttachment()!=null){
            fileService.deleteOldFile(hoax.getFileAttachment().getName());
        }
        hoaxRepository.deleteById(id);
    }


}

