class FileStorageHttpTemplate {
    constructor() {
        this.root = `${contextPath}/file`
    }

    upload(files, folderNo, uploadProgress, uploadLoadstart, uploadLoadend) {
        let formData = new FormData();

        formData.append("folderNo", folderNo);

        for(const file of files) {
            formData.append('files', file);
        }

        return new Promise((resolve, reject) => {
            ajax(`${this.root}/upload`, 'POST', formData, {
                uploadProgress: uploadProgress,
                uploadLoadstart: uploadLoadstart,
                uploadLoadend: uploadLoadend,
                loadDone: (data, xhr) => {
                    resolve(data);
                },
                loadFail: (err, xhr) => {
                    reject(err);
                }
            });
        });
    }

    download(fileNo) {
        const url = `${this.root}/download?fileNo=${fileNo}`;

        let req = new XMLHttpRequest();

        req.responseType = "blob";

        req.open("GET", url, true);
        req.send();

        req.onload = function (event) {
            var blob = req.response;

            var fileName = req.getResponseHeader("Content-Disposition") //if you have the fileName header available
            fileName = fileName && fileName.match(/fileName[^;=\n]*="((['"]).*?\2|[^;\n]*)"/)[1];
            fileName = decodeURIComponent(fileName);

            var link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = fileName;

            link.click();
        };
    }

    list(folderNo) {
        return new Promise((resolve, reject) => {
            let formData = new FormData();

            formData.append("folderNo", folderNo);

            ajax(`${this.root}/list`, 'POST', formData, {
                loadDone: (data, xhr) => {
                    resolve(data);
                },
                loadFail: (err, xhr) => {
                    reject(err);
                }
            });
        });
    }

    newFolder(folderNo, folderName) {
        const url = `${this.root}/newFolder`;

        let formData = new FormData();
        formData.append("folderNo", folderNo);
        formData.append("folderName", folderName);

        return new Promise((resolve, reject) => {
            ajax(url, 'POST', formData, {
                loadDone: (data, xhr) => {
                    resolve(data);
                },
                loadFail: (err, xhr) => {
                    reject(err);
                }
            });
        })
    }

    move() {

    }

    cut() {

    }

    copy() {

    }

    paste(copyState, copyFileItem, folderNo) {
        const url = `${this.root}/paste`;

        let formData = new FormData();
        formData.append("copyState", copyState);
        formData.append("copyFile", copyFileItem);
        formData.append("folderNo", folderNo);

        return new Promise((resolve, reject) => {
            ajax(url, 'POST', formData, {
                loadDone: (data, xhr) => {
                    console.log(`sendFile done`);
                    console.log(data);

                    resolve(data);
                }, loadFail: (err, xhr) => {
                    console.log(`sendFile fail`);
                    console.log(err);

                    reject(err);
                }
            });
        })
    }

    delete(folderNo, fileNo) {
        let formData = new FormData();
        formData.append("folderNo", folderNo);
        formData.append("fileNo", fileNo);

        ajax(`//localhost:8080/file/delete`, 'POST', formData, {
            loadDone: (data, xhr) => {
                console.log(`sendFile done`);
                console.log(data);
            },
            loadFail: (err, xhr) => {
                console.log(`sendFile fail`);
                console.log(err);
            }
        });
    }
}