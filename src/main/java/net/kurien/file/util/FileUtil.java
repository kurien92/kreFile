package net.kurien.file.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import org.springframework.stereotype.Component;

@Component
public class FileUtil {
	public void copy(String copyFilePath, String pasteFilePath) throws IOException {
		InputStream inputStream = null;
		OutputStream outputStream = null;
		
		try {
			inputStream = new FileInputStream(copyFilePath);
			outputStream = new FileOutputStream(pasteFilePath);
			
			int bufferLength = 0;
			byte[] buffer = new byte[1024];
			
			while((bufferLength = inputStream.read(buffer)) > 0) {
				outputStream.write(buffer, 0, bufferLength);
			}
		} catch(IOException ioe) {
			throw new IOException(ioe);
		} finally {
			inputStream.close();
			outputStream.close();
		}
	}

	public void write(String uploadFilePath, byte[] fileBytes) throws IOException {
		// TODO Auto-generated method stub
		OutputStream outputStream = null;
		
		try {
			outputStream = new FileOutputStream(uploadFilePath);
			
			outputStream.write(fileBytes);
		} catch(FileNotFoundException fnfe) {
			throw new IOException(fnfe);
		} finally {
			outputStream.close();
		}
	}
	
	public void rename(String filePath, String destFilePath) {
		File file = new File(filePath);
		File destFile = new File(destFilePath);
		
		file.renameTo(destFile);
	}
}
