class FileStorageService {
    constructor(fileStorageHttpTemplate) {
        this.fileStorageHttpTemplate = fileStorageHttpTemplate;
    }

    async getList(folderNo) {
        try {
            return await this.fileStorageHttpTemplate.list(folderNo);
        } catch(err) {
            throw new Error(err);
        }
    }

    async upload(files, folderNo, uploadProgress, uploadLoadstart, uploadLoadend) {
        try {
            return await this.fileStorageHttpTemplate.upload(files, folderNo, uploadProgress, uploadLoadstart, uploadLoadend);
        } catch(err) {
            throw new Error(err);
        }
    }

    download(fileNo) {
        this.fileStorageHttpTemplate.download(fileNo);
    }

    async newFolder(folderNo, folderName) {
        try {
            return await this.fileStorageHttpTemplate.newFolder(folderNo, folderName);
        } catch(err) {
            throw new Error(err);
        }
    }

    move() {

    }

    cut() {

    }

    copy() {

    }

    async paste(copyState, copyFileItem, folderNo) {
        try {
            let result = await this.fileStorageHttpTemplate.paste(copyState, copyFileItem, folderNo);

            return result;
        } catch(err) {
            throw new Error(err);
        }
    }

    delete(folderNo, fileNo) {
        this.fileStorageHttpTemplate.delete(folderNo, fileNo);
    }
}