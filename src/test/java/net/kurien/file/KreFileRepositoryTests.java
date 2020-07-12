package net.kurien.file;

import static org.hamcrest.CoreMatchers.is;
import static org.junit.Assert.assertThat;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import net.kurien.file.entity.KreFile;
import net.kurien.file.repository.KreFileRepository;

@RunWith(SpringRunner.class)
@SpringBootTest
public class KreFileRepositoryTests {
	@Autowired
	private KreFileRepository kreFileRepository;

	@Test
	public void contextLoads() throws ParseException {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		
		Date date = sdf.parse("2019-08-31 11:06:53.001");
		
		KreFile file = KreFile.builder()
				.fileExtension("jpeg")
				.fileUploadIp("192.168.0.200")
				.fileMime("image/jpeg")
				.fileName("파일이름.jpeg")
				.fileSize(11232)
				.fileStoredName("AGqERADSFWErFWAFSdS.jpeg")
				.fileUploadTime(date.toString())
				.build();
	
		kreFileRepository.save(file);
		
		List<String> tempList = new ArrayList<>();
		tempList.add("AGqERADSFWErFWAFSdS.jpeg");
		
		List<KreFile> fileList = kreFileRepository.findByFileStoredNameIn(tempList);

        System.out.println(tempList);
        System.out.println(fileList);
		
		KreFile kreFile = fileList.get(0);

        assertThat(kreFile.getFileName(), is("파일이름.jpeg"));
        assertThat(kreFile.getFileMime(), is("image/jpeg"));
        assertThat(kreFile.getFileUploadTime().toString(), is("2019-08-31 11:06:53.001"));
        
        System.out.println("- save -");
        System.out.println(fileList);
	}
	
	@After
	public void delete() {
		kreFileRepository.deleteAll();
		
		List<KreFile> fileList = kreFileRepository.findAll();
		
		System.out.println("- delete -");
        System.out.println(fileList);
	}
}
