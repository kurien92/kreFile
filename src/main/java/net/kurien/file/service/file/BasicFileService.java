package net.kurien.file.service.file;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import net.kurien.file.entity.KreFile;
import net.kurien.file.repository.KreFileRepository;
import net.kurien.file.util.FileUtil;
import net.kurien.file.vo.KreFileDownloadVO;

@Service
public class BasicFileService implements FileService {
	@Autowired
	private KreFileRepository kreFileRepository;
	
	@Autowired
	private FileUtil fileUtil;
	
	@Override
	public String upload(String uploadFilePath, int[] folderNo, byte[] fileBytes, String originalFilename, long size, String contentType) throws IOException {
		// TODO Auto-generated method stub
		String filePath = uploadFilePath;

		File file = new File(filePath);
		
		if(file.exists() == false) {
			file.mkdirs();
		}
		
		if(folderNo.length != 0) {
			for(int i = 0; i < folderNo.length; i++) {
				KreFile kreFile = kreFileRepository.getOne(folderNo[i]);
				
				filePath += File.separator + kreFile.getFileStoredName();
				
				file = new File(filePath);
				
				if(file.exists() == false) {
					file.mkdirs();
				}
			}
		}

		String fileExtension = getFileExtension(originalFilename);
		
		String storedFilename = getRandomFileName(filePath, fileExtension);
		file = new File(filePath + File.separator + storedFilename);

		uploadFilePath = filePath + File.separator + storedFilename;
		
		fileUtil.write(uploadFilePath, fileBytes);

		Date date = new Date(); 
		
		KreFile kreFile = KreFile.builder()
				.fileType("file")
				.filePath(filePath)
				.fileExtension(fileExtension)
				.fileUploadIp("127.0.0.1")
				.fileMime(getMimeType(filePath + File.separator + storedFilename))
				.fileName(originalFilename)
				.fileSize(fileBytes.length)
				.fileStoredName(storedFilename)
				.fileUploadTime(date.toString())
				.build();
		
		kreFileRepository.save(kreFile);
		
		return storedFilename;
	}

	private String getRandomFileName(String path, String fileExtension) {
		// TODO Auto-generated method stub
		String storedFilename = null;
		File file = null;
		
		do {
			storedFilename = getRandomString();
			
			if(fileExtension != null) {
				storedFilename += fileExtension;
			}
			
			String filePath = path + File.separator + storedFilename;
			file = new File(filePath);
		} while(file.exists() == true);
		
		return storedFilename;
	}

	@Override
	public KreFileDownloadVO download(String uploadFilePath, int fileNo) throws Exception {
		// TODO Auto-generated method stub
		String filePath = uploadFilePath;
		
		KreFile kreFile = kreFileRepository.getOne(fileNo);
		filePath = kreFile.getFilePath();
		
		File file = new File(filePath);
		
		if(file.exists() == false) {
			throw new FileNotFoundException("업로드 폴더가 존재하지 않습니다.");
		}
		
		file = new File(filePath + File.separator + kreFile.getFileStoredName());

		if(file.exists() == false) {
			throw new FileNotFoundException(kreFile.getFileName() + " 파일이 존재하지 않습니다.");
		}
		
		FileInputStream fis = null;
		byte[] fileBytes = null;
		
		try {
			fileBytes = new byte[(int) file.length()];
			
			fis = new FileInputStream(file);
			fis.read(fileBytes);
		} catch(IOException  ioe) {
			throw new IOException(ioe);
		} finally {
			if(fis != null) {
				fis.close();				
			}
		}
		
		KreFileDownloadVO kreFileDownloadVO = KreFileDownloadVO.builder()
				.fileName(kreFile.getFileName())
				.fileBytes(fileBytes)
				.build();
		
		return kreFileDownloadVO;
	}
	
	private String getFileExtension(String filename) {
		int lastIndex = filename.lastIndexOf('.');
		String ext = null;
		
		if(lastIndex == -1) {
			return null;
		}
		
		ext = filename.substring(lastIndex);
		
		return ext;
	}
	
	private String getRandomString() {
		String randomString = UUID.randomUUID().toString().replaceAll("-", "");
		
		return randomString;
	}

	@Override
	public List<Map<String, Object>> list(String uploadFilePath, int[] folderNo) {
		// TODO Auto-generated method stub
		String filePath = uploadFilePath;

		filePath += getFolderPath(folderNo);
		
		File directory = new File(filePath);
		
		File[] fileList = directory.listFiles();

		List<Map<String, Object>> returnFiles = new ArrayList<>();

		if(fileList == null) {
			return returnFiles;
		}

		List<String> kreFilesStoredFilename = new ArrayList<>();
		
		for(File file : fileList) {
			kreFilesStoredFilename.add(file.getName());
		}
		
		List<KreFile> kreFiles = new ArrayList<>();
		
		if(kreFilesStoredFilename.size() > 0) {
			kreFiles = kreFileRepository.findByFileStoredNameIn(kreFilesStoredFilename);
		}

		if(folderNo.length != 0) {
			Map<String, Object> prevFile = new HashMap<>();
			prevFile.put("fileNo",  0);
			prevFile.put("fileName", "이전");
			prevFile.put("fileType", "folder");
	
			returnFiles.add(prevFile);
		}
		
		if(kreFiles.size() == 0) {
			return returnFiles;
		}
		
		for(KreFile oneKreFile : kreFiles) {
			Map<String, Object> kreFile = new HashMap<>();
			
			kreFile.put("fileNo",  oneKreFile.getFileNo());
			kreFile.put("fileName", oneKreFile.getFileName());
			kreFile.put("fileType", oneKreFile.getFileType());

			returnFiles.add(kreFile);
		}
		
		return returnFiles;
	}

	@Override
	public void delete(String uploadFilePath, int[] folderNo, int[] fileNo) {
		// TODO Auto-generated method stub
		String filePath = uploadFilePath;
		
		filePath += getFolderPath(folderNo);
		
		for(int i = 0; i < fileNo.length; i++) {
			KreFile kreFile = kreFileRepository.getOne(fileNo[i]);
			
			if(kreFile.getFileType().equals("file")) {
				File file = new File(filePath + File.separator + kreFile.getFileStoredName());
				file.delete();
				
				kreFileRepository.deleteById(fileNo[i]);
				continue;
			}
			
			String folderFilePath = filePath + File.separator + kreFile.getFileStoredName();
			List<KreFile> kreFilesInFolder = kreFileRepository.findByFilePath(folderFilePath);
			
			System.out.println(kreFilesInFolder);
			
			if(kreFilesInFolder.size() != 0) {
				for(int j = 0; j < kreFilesInFolder.size(); j++) {
					KreFile kreFileInFolder = kreFilesInFolder.get(j);
					
					File file = new File(folderFilePath + File.separator + kreFileInFolder.getFileStoredName());
					file.delete();
					
					kreFileRepository.deleteById(kreFileInFolder.getFileNo());
				}
			}

			File file = new File(filePath + File.separator + kreFile.getFileStoredName());
			file.delete();
			
			kreFileRepository.deleteById(fileNo[i]);
		}
	}

	private String getMimeType(String path) throws IOException {
		// TODO Auto-generated method stub
		Path filePath = Paths.get(path);
		String mimeType = Files.probeContentType(filePath);
		
		return mimeType;
	}

	@Override
	public String newfolder(String uploadFilePath, int[] folderNo, String folderName) {
		// TODO Auto-generated method stub
		String filePath = uploadFilePath;
		File file = null;
		
		if(folderNo.length != 0) {
			for(int i = 0; i < folderNo.length; i++) {
				KreFile kreFile = kreFileRepository.getOne(folderNo[i]);
				
				filePath += File.separator + kreFile.getFileStoredName();

				file = new File(filePath);
				
				if(file.exists() == false) {
					file.mkdir();
				}
			}
		}

		file = new File(filePath);
		
		if(file.exists() == false) {
			file.mkdirs();
		}

		String fileExtension = getFileExtension(folderName);
		
		String randomFilename = null;
		String storedFilename = null;
		String path = null;
		
		do {
			randomFilename = getRandomString();
			storedFilename = randomFilename;
			
			if(fileExtension != null) {
				storedFilename += fileExtension;
			}
			
			path = filePath + File.separator + storedFilename;
			file = new File(path);
		} while(file.exists() == true);
		
		file.mkdir();

		Date date = new Date(); 
		
		KreFile kreFile = KreFile.builder()
				.fileType("folder")
				.filePath(filePath)
				.fileExtension(null)
				.fileUploadIp("127.0.0.1")
				.fileMime(null)
				.fileName(folderName)
				.fileSize(0)
				.fileStoredName(storedFilename)
				.fileUploadTime(date.toString())
				.build();
		
		kreFileRepository.save(kreFile);
		
		return storedFilename;
	}
	
	private String getFolderPath(int[] folderNo) {
		String filePath = "";
		
		if(folderNo.length == 0) {
			return "";
		}
		
		for(int i = 0; i < folderNo.length; i++) {
			KreFile kreFile = kreFileRepository.getOne(folderNo[i]);
			
			filePath += File.separator + kreFile.getFileStoredName();
		}
		
		return filePath;
	}

	@Override
	public void cutAndPaste(String uploadFilePath, int[] cutFile, int[] folderNo) throws FileNotFoundException {
		// TODO Auto-generated method stub
		String filePath = uploadFilePath;
		
		filePath += getFolderPath(folderNo);

		File file = new File(filePath);
		
		if(file.exists() == false) {
			throw new FileNotFoundException("업로드 폴더가 존재하지 않습니다.");
		}
		
		for(int i = 0; i < cutFile.length; i++) {
			KreFile kreFile = kreFileRepository.getOne(cutFile[i]);
			
			String currentfilePath = kreFile.getFilePath() + File.separator + kreFile.getFileStoredName();

			String storedFilename = getRandomFileName(filePath, kreFile.getFileExtension());
			String renameFilePath = filePath + File.separator + storedFilename;
			
			fileUtil.rename(currentfilePath, renameFilePath);
			
			kreFile.setFileStoredName(storedFilename);
			kreFile.setFilePath(filePath);
			kreFile.setFileUploadTime(new Date().toString());
			
			kreFileRepository.save(kreFile);
		}
	}

	@Override
	public void copyAndPaste(String uploadFilePath, int[] copyFile, int[] folderNo) throws IOException {
		// TODO Auto-generated method stub
		String filePath = uploadFilePath;
		
		filePath += getFolderPath(folderNo);

		File file = new File(filePath);
		
		if(file.exists() == false) {
			throw new FileNotFoundException("업로드 폴더가 존재하지 않습니다.");
		}
		
		for(int i = 0; i < copyFile.length; i++) {
			KreFile kreFile = kreFileRepository.getOne(copyFile[i]);
			
			String storedFilename = getRandomFileName(filePath, kreFile.getFileExtension());

			String copyFilePath = kreFile.getFilePath() + File.separator + kreFile.getFileStoredName();
			String pasteFilePath = filePath + File.separator + storedFilename;
			
			fileUtil.copy(copyFilePath, pasteFilePath);
			
			KreFile copiedKreFile = KreFile.builder()
					.fileExtension(kreFile.getFileExtension())
					.fileUploadIp("127.0.0.1")
					.fileMime(kreFile.getFileMime())
					.fileName(kreFile.getFileName())
					.filePath(filePath)
					.fileSize(kreFile.getFileSize())
					.fileStoredName(storedFilename)
					.fileType(kreFile.getFileType())
					.fileUploadTime(new Date().toString())
					.build();
			
			kreFileRepository.save(copiedKreFile);
		}
	}
}
