package net.kurien.file.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Setter
@ToString
@Entity
public class KreFile {
    @Builder
    public KreFile(String fileType, String filePath, String fileName, String fileStoredName, String fileExtension, String fileMime, Integer fileSize, String fileUploadIp, String fileUploadTime) {
        this.fileType = fileType;
        this.filePath = filePath;
        this.fileName = fileName;
        this.fileStoredName = fileStoredName;
        this.fileExtension = fileExtension;
        this.fileMime = fileMime;
        this.fileSize = fileSize;
        this.fileUploadIp = fileUploadIp;
        this.fileUploadTime = fileUploadTime;


    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer fileNo;

    @Column(length=6, nullable=false)
    private String fileType;

    @Column(nullable=false)
    private String filePath;

    @Column(nullable=false)
    private String fileName;

    @Column(nullable=false, unique = true)
    private String fileStoredName;

    @Column(length=10)
    private String fileExtension;

    @Column(length=100)
    private String fileMime;

    @Column(nullable=false)
    private Integer fileSize;

    @Column(length=100, nullable=false)
    private String fileUploadIp;

    @Column(length=100, nullable=false)
    private String fileUploadTime;
}

