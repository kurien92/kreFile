class FileStorageUi {
    constructor(
        dropZone,
        uploadedList,
        progressBar,
        contextMenuPopup,
        menuDownload,
        menuNewFolder,
        menuCut,
        menuCopy,
        menuPaste,
        menuDelete,
        dragBox,
        files,
        saveFile
    ) {
        this.dropZone = dropZone;
        this.uploadedList = uploadedList;
        this.progressBar = progressBar;
        this.contextMenuPopup = contextMenuPopup;
        this.menuDownload = menuDownload;
        this.menuNewFolder = menuNewFolder;
        this.menuCut = menuCut;
        this.menuCopy = menuCopy;
        this.menuPaste = menuPaste;
        this.menuDelete = menuDelete;
        this.dragBox = dragBox;
        this.files = files;
        this.saveFile = saveFile;
    }

    setFileList(fileList, copyState, copyFileItem) {
        for (let i = 0; i < this.uploadedList.children.length;) {
            this.uploadedList.removeChild(this.uploadedList.children[0]);
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

            let fileListItemHtml = "";

            if (fileType === "file") {
                fileListItem.classList.add("uploadedFile");
                fileListItemHtml = "<div><span class=\"material-icons\">description</span></div>";

            } else {
                fileListItem.classList.add("uploadedFolder");
                fileListItemHtml = "<div><span class=\"material-icons\">folder</span></div>";
            }

            fileListItemHtml += `<div>${fileList[i].fileName}</div>`;

            fileListItem.setAttribute("tabindex", "0");
            fileListItem.dataset.fileNo = fileNo;
            fileListItem.dataset.fileType = fileType;
            fileListItem.innerHTML = fileListItemHtml;

            this.uploadedList.appendChild(fileListItem);
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