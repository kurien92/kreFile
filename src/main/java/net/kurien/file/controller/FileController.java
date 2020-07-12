package net.kurien.file.controller;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import net.kurien.file.service.file.FileService;
import net.kurien.file.vo.KreFileDownloadVO;

@RestController
public class FileController {
	@Autowired
	private FileService fileService;
	
	private Map<String, String> tempFileMap = new HashMap<String, String>();
	
	@RequestMapping("/file/upload")
	public String upload(@RequestParam("files") List<MultipartFile> files, @RequestParam("folderNo") int[] folderNo, HttpServletRequest request) throws FileNotFoundException, IOException {
		String uploadFilePath = request.getServletContext().getRealPath("/") + "../../files/upload";
		
		for(int i = 0; i < files.size(); i++) {
			MultipartFile file = files.get(i);
			
			String storedFilename = fileService.upload(uploadFilePath, folderNo, file.getBytes(), file.getOriginalFilename(), file.getSize(), file.getContentType());
			tempFileMap.put(storedFilename, file.getOriginalFilename());
		}
		
		return "{}";
	}
	
	@RequestMapping(value = "/file/download")
	public void download(int fileNo, HttpServletRequest request, HttpServletResponse response) throws Exception {
		String uploadFilePath = request.getServletContext().getRealPath("/") + "../../files/upload";

		KreFileDownloadVO kreFileDownloadVO = fileService.download(uploadFilePath, fileNo);
		byte[] fileBytes = kreFileDownloadVO.getFileBytes();

		String userAgent = request.getHeader("User-Agent");
        
        boolean isMsBrowser = userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Edge") > -1 || userAgent.indexOf("Trident") > -1;

        String originalFilename = kreFileDownloadVO.getFileName();
        String downloadFilename = null;
        
//        if(isMsBrowser) {
        	downloadFilename = URLEncoder.encode(originalFilename, "utf-8").replaceAll("\\+", "\\ ");
//        } else {
//        	downloadFilename = new String(originalFilename.getBytes("UTF-8"), "ISO-8859-1");
//        }
        
		response.setContentType("application/octet-stream");
		response.setContentLength(fileBytes.length);
		response.setHeader("Content-Description", "File Transfer");
		response.setHeader("Content-Disposition", "attachment; fileName=\"" + downloadFilename + "\";");
		response.setHeader("Content-Transfer-Encoding", "binary");
		response.setHeader("Pragma", "no-cache;");
		response.setHeader("Expires", "-1;");
		
		response.getOutputStream().write(fileBytes);
		response.getOutputStream().flush();
		response.getOutputStream().close();
	}
	
	@RequestMapping("/file/list")
	public List<Map<String, Object>> list(int[] folderNo, HttpServletRequest request) {
		String uploadFilePath = request.getServletContext().getRealPath("/") + "../../files/upload";
		
		List<Map<String, Object>> kreFiles = fileService.list(uploadFilePath, folderNo);
		
		return kreFiles;
	}
	
	@RequestMapping("/file/delete")
	public String delete(int[] fileNo, int[] folderNo, HttpServletRequest request) {
		String uploadFilePath = request.getServletContext().getRealPath("/") + "../../files/upload";
		
		fileService.delete(uploadFilePath, folderNo, fileNo);
			
		return "{}";
	}
	
	@RequestMapping("/file/newFolder")
	public String newfolder(String folderName, int[] folderNo, HttpServletRequest request) {
		String uploadFilePath = request.getServletContext().getRealPath("/") + "../../files/upload";
		
		fileService.newfolder(uploadFilePath, folderNo, folderName);
		
		return "{}";
	}
	
	@RequestMapping("/file/paste")
	public String paste(String copyState, int[] copyFile, int[] folderNo, HttpServletRequest request) throws IOException {
		String uploadFilePath = request.getServletContext().getRealPath("/") + "../../files/upload";
		
		if(copyState.equals("cut")) {
			fileService.cutAndPaste(uploadFilePath, copyFile, folderNo);			
		} else if(copyState.equals("copy")) {
			fileService.copyAndPaste(uploadFilePath, copyFile, folderNo);
		}
		
		return "{}";
	}
}
