package net.kurien.file.vo;

import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@ToString
public class KreFileDownloadVO {
	@Builder
    public KreFileDownloadVO(String fileName, byte[] fileBytes) {
	    this.fileName = fileName;
        this.fileBytes = fileBytes;
    }
	
	private String fileName;
	private byte[] fileBytes;
}
