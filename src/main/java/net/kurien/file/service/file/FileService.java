package net.kurien.file.service.file;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import net.kurien.file.vo.KreFileDownloadVO;

public interface FileService {
	public String upload(String uploadFilePath, int[] folderNo, byte[] fileBytes, String originalFilename, long size, String contentType) throws FileNotFoundException, IOException;
	public KreFileDownloadVO download(String uploadFilePath, int fileNo) throws Exception;
	public List<Map<String, Object>> list(String uploadFilePath, int[] folderNo);
	public void delete(String uploadFilePath, int[] folderNo, int[] fileNo);
	public String newfolder(String uploadFilePath, int[] folderNo, String folderName);
	public void cutAndPaste(String uploadFilePath,int[] cutFile, int[] folderNo) throws FileNotFoundException;
	public void copyAndPaste(String uploadFilePath, int[] copyFile, int[] folderNo) throws IOException;
}
