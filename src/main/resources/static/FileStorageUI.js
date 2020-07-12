class FileStorageUI {
    constructor(ui) {
        this.fileArea = ui.fileArea;
        this.fileList = ui.fileList;
    }

    setFileList(fileList) {
        for (let i = 0; i < this.fileList.children.length;) {
            this.fileList.removeChild(this.fileList.children[0]);
        }

        if (fileList === null || fileList.length === 0) {
            return;
        }

        for (let i = 0; i < fileList.length; i++) {
            let fileListItem = document.createElement("li");

            let fileNo = fileList[i].fileNo;
            let fileType = fileList[i].fileType;

            fileListItem.id = `file${fileNo}`;
            fileListItem.classList.add("uploadedList");

            if (fileType === "file") {
                fileListItem.classList.add("uploadedFile");
            } else {
                fileListItem.classList.add("uploadedFolder");
            }

            fileListItem.setAttribute("tabindex", "0");
            fileListItem.dataset.fileNo = fileNo;
            fileListItem.dataset.fileType = fileType;
            fileListItem.innerText = fileList[i].fileName;

            this.fileList.appendChild(fileListItem);
        }

        for(let i = 0; i < copyFileItem.length; i++) {
            let copyFile = document.getElementById(`file${copyFileItem[i]}`);
            
            if(copyFile !== null && copyState !== null) {
                if(copyState === "cut") {
                    copyFile.classList.add("cutFile");
                } else if (copyState === "copy") {
                    copyFile.classList.add("copyFile");
                }
            }
        }
    }
}