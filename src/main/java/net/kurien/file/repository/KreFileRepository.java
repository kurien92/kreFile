package net.kurien.file.repository;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import net.kurien.file.entity.KreFile;

@Repository
@Transactional
public interface KreFileRepository extends JpaRepository<KreFile, Integer> {
	@Query("SELECT kf FROM KreFile kf WHERE kf.fileStoredName IN (?1) ORDER BY kf.fileType DESC, kf.fileName ASC")
	List<KreFile> findByFileStoredNameIn(List<String> files);
	List<KreFile> findByFilePath(String filePath);
}
