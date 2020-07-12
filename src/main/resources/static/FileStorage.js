class FileStorage {
    constructor() {
        this.selectFiles = [];
        this.folderNos = [];
        this.copyFiles = [];
        this.copyState = null;
    }

    selectFile() {

    }

    list(folderNos) {
        return new Promise((resolve, reject) => {
            let formData = new FormData();
    
            formData.append("folderNo", folderNos);
    
            ajax(`${contextPath}/file/list`, 'POST', formData, {
                loadDone: (data, xhr) => {
                    resolve(data);
                },
                loadFail: (err, xhr) => {
                    reject(err);
                }
            });
        });
    }

    upload() {

    }

    download(urlToSend, formData) {
        let req = new XMLHttpRequest();

        req.responseType = "blob";

        req.open("GET", urlToSend, true);
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

    newFolder(url, formData) {
        ajax(url, 'POST', formData, {
            loadDone: (data, xhr) => {
                console.log(`sendFile done`);
                console.log(data);
                loadUploadedList();
            },
            loadFail: (err, xhr) => {
                console.log(`sendFile fail`);
                console.log(err);
            }
        });
    }

    rename() {

    }

    cut() {

    }

    copy() {

    }

    paste() {

    }
}