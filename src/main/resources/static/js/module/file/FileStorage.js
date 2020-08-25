class FileStorage {
    constructor(fileStorageUi, fileStorageService) {
        this.fileStorageUi = fileStorageUi;
        this.fileStorageService = fileStorageService;

        this.selectedItem = []; // 선택된 항목
        this.uploadFolderNo = []; // 업로드 되는 폴더의 번호
        this.copyFileItem = []; // 복사할 파일의 번호
        this.copyState = null; // 잘라내기, 복사 상태
    }

    init() {
        this.setEvent();
        this._loadFileList();

        window.addEventListener('mousedown', (function (e) {
            if ((e.button === 1 || e.which === 1)) {
                windowMousedownLeft.bind(this)(e);
                return;
            }

            if ((e.button === 2 || e.which === 3)) {
                windowMousedownRight.bind(this)(e);
                return;
            }
        }).bind(this));

        let page = {
            x: 0,
            y: 0
        }

        function windowMousedownLeft(e) {
            let checkContextMenuPopup = false;
            let checkDropZone = false;

            for (let i = 0; i < e.path.length; i++) {
                if (e.path[i].nodeName === "NAV" && e.path[i].id === "contextMenuPopup") {
                    checkContextMenuPopup = true;
                }

                if (e.path[i].id === "dropZone") {
                    checkDropZone = true;
                }
            }

            if (checkContextMenuPopup === false) {
                this.fileStorageUi.contextMenuPopup.style.display = "none";
            }

            if (checkDropZone === true) {
                page.x = e.pageX;
                page.y = e.pageY;

                this.fileStorageUi.dragBox.style.width = 0;
                this.fileStorageUi.dragBox.style.height = 0;

                this.fileStorageUi.dragBox.style.display = "block";

                this.fileStorageUi.dragBox.style.left = e.pageX + "px";
                this.fileStorageUi.dragBox.style.top = e.pageY + "px";
            }
        }

        function windowMousedownRight(e) {
            let checkDropZoneList = false;

            for (let i = 0; i < e.path.length; i++) {
                if (e.path[i].nodeName === "LI" && e.path[i + 2].id === "dropZone") {
                    checkDropZoneList = true;
                    break;
                } else if (e.path[i].nodeName === "NAV" && e.path[i].id === "contextMenuPopup") {
                    checkDropZoneList = true;
                    break;
                } else if (e.path[i].nodeName === "DIV" && e.path[i].id === "dropZone") {
                    checkDropZoneList = true;
                    break;
                }
            }

            if (checkDropZoneList) {
                return;
            }

            this.fileStorageUi.contextMenuPopup.style.display = "none";
        }

        window.addEventListener('mousemove', ((e) => {
            if ((e.button === 1 || e.which === 1)) {
                windowMousemoveLeft.bind(this)(e);
                return;
            }
        }).bind(this));

        function windowMousemoveLeft(e) {
            let checkDropZone = false;

            for (let i = 0; i < e.path.length; i++) {
                if (e.path[i].id === "dropZone") {
                    checkDropZone = true;
                    break;
                }
            }

            if (checkDropZone === false) {
                return;
            }

            let position = {
                top: 0,
                left: 0,
                right: 0,
                bottom: 0
            }

            position.left = page.x;
            position.top = page.y;

            let width = e.pageX - page.x;
            let height = e.pageY - page.y;

            if (width < 0) {
                position.left = e.pageX;
                width = Math.abs(width);
            }

            if (height < 0) {
                position.top = e.pageY;
                height = Math.abs(height);
            }

            this.fileStorageUi.dragBox.style.top = position.top + "px";
            this.fileStorageUi.dragBox.style.left = position.left + "px";

            this.fileStorageUi.dragBox.style.width = width + "px";
            this.fileStorageUi.dragBox.style.height = height + "px";

            position.right = position.left + width;
            position.bottom = position.top + height;


            this.selectedItem = [];

            let selectedClassItem = document.getElementsByClassName("selected");

            for (let i = 0; i < selectedClassItem.length;) {
                selectedClassItem[i].classList.remove("selected");
            }

            let uploadedListChild = this.fileStorageUi.uploadedList.children;

            for (let i = 0; i < uploadedListChild.length; i++) {
                let currentList = uploadedListChild[i];

                let currentPosition = {
                    top: currentList.offsetTop,
                    left: currentList.offsetLeft,
                    right: currentList.offsetLeft + currentList.offsetWidth,
                    bottom: currentList.offsetTop + currentList.offsetHeight
                }

                if (dragSelectedList.bind(this)(position, currentPosition)) {
                    currentList.classList.add("selected");
                    this.selectedItem.push(currentList);
                }
            }
        }

        /**
         * @param position 마우스 포인팅 위치
         * @param currentPosition 드래그 항목 위치
         * @returns {boolean}
         */
        function dragSelectedList(position, itemPosition) {
            // 드래그 영역 내 점 하나 이상 포함
            if(this.dragOnDot(position, itemPosition) === true) {
                return true;
            }

            // 드래그 영역 내 선 하나 이상 포함
            if(this.dragOnLine(position, itemPosition) === true) {
                return true;
            }

            // 드래그 영역 내 면 하나 이상 포함
            if(this.dragOnPlane(position, itemPosition) === true) {
                return true;
            }

            return false;
        }

        window.addEventListener('mouseup', (function (e) {
            if ((e.button === 1 || e.which === 1)) {
                this.fileStorageUi.dragBox.style.width = e.pageX - page.x + "px";
                this.fileStorageUi.dragBox.style.height = e.pageY - page.y + "px";

                this.fileStorageUi.dragBox.style.display = "none";
                return;
            } else if ((e.button === 2 || e.which === 3) === false) {
                this.fileStorageUi.contextMenuPopup.style.display = "none";
                return;
            }
        }).bind(this));
    }

    dragOnDot(p, ip) {
        if(p.bottom >= ip.top && p.right >= ip.left && p.top <= ip.top && p.left <= ip.left) {
            return true;
        } else if (p.bottom >= ip.top && p.left <= ip.right && p.top <= ip.top && p.right >= ip.right) {
            return true;
        } else if (p.top <= ip.bottom && p.right >= ip.left && p.bottom >= ip.bottom && p.left <= ip.left) {
            return true;
        } else if (p.top <= ip.bottom && p.left <= ip.right && p.bottom >= ip.bottom && p.right >= ip.right) {
            return true;
        }

        return false;
    }

    dragOnLine(p, ip) {
        if(p.left <= ip.left && p.right >= ip.left && p.top >= ip.top && p.bottom <= ip.bottom) {
            return true;
        } else if(p.right >= ip.right && p.left <= ip.right && p.top >= ip.top && p.bottom <= ip.bottom) {
            return true;
        } else if(p.top <= ip.top && p.bottom >= ip.top && p.left >= ip.left && p.right <= ip.right) {
            return true;
        } else if(p.bottom >= ip.bottom && p.top <= ip.bottom && p.left >= ip.left && p.right <= ip.right) {
            return true;
        }

        return false;
    }

    dragOnPlane(p, ip) {
        if(p.top >= ip.top && p.bottom <= ip.bottom && p.left >= ip.left && p.right <= ip.right) {
            return true;
        }

        return false;
    }

    setEvent() {
        this.fileStorageUi.dropZone.addEventListener("mousedown", this.mousedownDropZone.bind(this));
        this.fileStorageUi.dropZone.addEventListener("mousedown", this.mousemoveDropZone.bind(this));
        this.fileStorageUi.dropZone.addEventListener("mousedown", this.mouseupDropZone.bind(this));
        this.fileStorageUi.dropZone.addEventListener("dblclick", this.dblclickDropZone.bind(this));
        this.fileStorageUi.dropZone.addEventListener('dragover', this.dragoverDropZone.bind(this));
        this.fileStorageUi.dropZone.addEventListener('dragenter', this.dragenterDropZone.bind(this));
        this.fileStorageUi.dropZone.addEventListener('dragleave', this.dragleaveDropZone.bind(this));
        this.fileStorageUi.dropZone.addEventListener('drop', this.dropDropZone.bind(this));

        this.fileStorageUi.dropZone.addEventListener('contextmenu', this.contextmenuHandler.bind(this));
        this.fileStorageUi.contextMenuPopup.addEventListener('contextmenu', this.contextmenuHandler.bind(this));

        this.fileStorageUi.menuDownload.addEventListener("click", this.clickMenuDownload.bind(this));
        this.fileStorageUi.menuNewFolder.addEventListener("click", this.clickMenuNewFolder.bind(this));
        this.fileStorageUi.menuCut.addEventListener("click", this.clickMenuCut.bind(this));
        this.fileStorageUi.menuCopy.addEventListener("click", this.clickMenuCopy.bind(this));
        this.fileStorageUi.menuPaste.addEventListener("click", this.clickMenuPaste.bind(this));
        this.fileStorageUi.menuDelete.addEventListener("click", this.clickMenuDelete.bind(this));

        this.fileStorageUi.saveFile.addEventListener("click", this.clickSaveFile.bind(this));
    }

    mousedownDropZone(e) {
        e.preventDefault();

        if (e.button === 1 || e.which === 1) {
            this.dropZoneMouseDownLeft(e);
            return;
        } else if (e.button === 2 || e.which === 3) {
            this.dropZoneMouseDownRight(e);
            return;
        }
    }

    dropZoneMouseDownLeft(e) {
        let checkDropZoneList = false;

        this.selectedItem = [];

        for (let i = 0; i < e.path.length; i++) {
            if (e.path[i].nodeName === "LI" && e.path[i + 2].id === "dropZone") {
                checkDropZoneList = true;
                this.selectedItem.push(e.path[i]);
                break;
            }
        }

        if (!checkDropZoneList) {
            return;
        }

        let selectedClassItem = document.getElementsByClassName("selected");

        for (let i = 0; i < selectedClassItem.length;) {
            selectedClassItem[i].classList.remove("selected");
        }

        this.selectedItem[0].classList.add("selected");
    }

    dropZoneMouseDownRight(e) {
        let checkDropZoneList = false;

        for (let i = 0; i < e.path.length; i++) {
            if (e.path[i].nodeName === "LI" && e.path[i + 2].id === "dropZone") {
                checkDropZoneList = true;

                if(this.selectedItem.indexOf(e.path[i]) === -1) {
                    this.selectedItem = [];

                    let selectedClassItem = document.getElementsByClassName("selected");

                    for (let i = 0; i < selectedClassItem.length;) {
                        selectedClassItem[i].classList.remove("selected");
                    }
                }

                if (this.selectedItem.length === 0) {
                    this.selectedItem.push(e.path[i]);
                    this.selectedItem[0].classList.add("selected");
                }

                break;
            }
        }

        this.fileStorageUi.contextMenuPopup.style.display = "block";
        this.fileStorageUi.contextMenuPopup.style.top = e.pageY + "px";
        this.fileStorageUi.contextMenuPopup.style.left = e.pageX + "px";

        if (checkDropZoneList) {
            this.fileStorageUi.menuNewFolder.setAttribute("disabled", true);
            this.fileStorageUi.menuPaste.setAttribute("disabled", true);
            this.fileStorageUi.menuDownload.removeAttribute("disabled");
            this.fileStorageUi.menuCut.removeAttribute("disabled");
            this.fileStorageUi.menuCopy.removeAttribute("disabled");
            this.fileStorageUi.menuDelete.removeAttribute("disabled");
            return;
        }

        this.fileStorageUi.menuNewFolder.removeAttribute("disabled");

        if(this.copyFileItem.length !== 0) {
            this.fileStorageUi.menuPaste.removeAttribute("disabled");
        } else {
            this.fileStorageUi.menuPaste.setAttribute("disabled", true);
        }

        this.fileStorageUi.menuDownload.setAttribute("disabled", true);
        this.fileStorageUi.menuCut.setAttribute("disabled", true);
        this.fileStorageUi.menuCopy.setAttribute("disabled", true);
        this.fileStorageUi.menuDelete.setAttribute("disabled", true);
    }

    mousemoveDropZone(e) {

    }

    mouseupDropZone(e) {

    }

    async dblclickDropZone(e) {
        if ((e.button === 1 || e.which === 1)) {
            let checkDropZoneList = false;

            if(this.selectedItem.length !== 1) {
                return;
            }

            if(this.selectedItem[0].dataset.fileType !== "folder") {
                return;
            }

            if(this.selectedItem[0].dataset.fileNo === "0") {
                this.uploadFolderNo.pop();
                await this._loadFileList();
                return;
            }

            this.uploadFolderNo.push(this.selectedItem[0].dataset.fileNo);
            await this._loadFileList();
            return;
        }
    }

    dragoverDropZone(e) {
        e.stopPropagation();
        e.preventDefault();

        e.dataTransfer.dropEffect = 'copy';
    }

    dragenterDropZone(e) {
        this.fileStorageUi.dropZone.classList.add("dragged");
    }

    dragleaveDropZone(e) {
        this.fileStorageUi.dropZone.classList.remove("dragged");
    }

    dropDropZone(e) {
        e.stopPropagation();
        e.preventDefault();

        this.fileStorageUi.dropZone.classList.remove("dragged");
        this.uploadFile.bind(this)(e.dataTransfer.files);
    }

    contextmenuHandler(e) {
        e.preventDefault();
    }

    clickMenuDownload(e) {
        if (this.selectedItem.length === 0) {
            alert("다운로드 할 파일을 선택해주세요.");
            return;
        }

        let fileNo = this.selectedItem[0].dataset.fileNo;

        fileStorageService.download(fileNo);
    }

    async clickMenuNewFolder(e) {
        this.fileStorageUi.contextMenuPopup.style.display = "none";

        let newFolderName = prompt("새폴더 이름을 입력하세요.");

        if (newFolderName === null || newFolderName === "") {
            alert("생성할 폴더명을 입력해주세요.");
            return;
        }

        try {
            await fileStorageService.newFolder(this.uploadFolderNo, newFolderName);
            await this._loadFileList();
        } catch(err) {
            console.error(err);
            alert("새폴더 생성 중 오류가 발생했습니다.");
        }
    }

    clickMenuCut(e) {
        this.fileStorageUi.contextMenuPopup.style.display = "none";
        this.copyState = "cut";

        for(let i = 0; i < this.copyFileItem.length; i++) {
            let copyFile = document.getElementById(`file${this.copyFileItem[i]}`);

            copyFile.classList.remove("cutFile");
            copyFile.classList.remove("copyFile");
        }

        this.copyFileItem = [];

        for(let i = 0; i < this.selectedItem.length; i++) {
            this.selectedItem[i].classList.add("cutFile")
            this.copyFileItem.push(this.selectedItem[i].dataset.fileNo);
        }
    }

    clickMenuCopy(e) {
        this.fileStorageUi.contextMenuPopup.style.display = "none";
        this.copyState = "copy";

        for(let i = 0; i < this.copyFileItem.length; i++) {
            let copyFile = document.getElementById(`file${this.copyFileItem[i]}`);

            copyFile.classList.remove("cutFile");
            copyFile.classList.remove("copyFile");
        }

        this.copyFileItem = [];

        for(let i = 0; i < this.selectedItem.length; i++) {
            this.selectedItem[i].classList.add("copyFile")
            this.copyFileItem.push(this.selectedItem[i].dataset.fileNo);
        }
    }

    async clickMenuPaste(e) {
        try {
            this.fileStorageUi.contextMenuPopup.style.display = "none";

            await this.fileStorageService.paste(this.copyState, this.copyFileItem, this.uploadFolderNo);
            await this._reloadFileList();
        } catch(err) {
            console.error(`FileStorage.clickMenuPaste`);
            console.error(err);
        }
    }

    async clickMenuDelete(e) {
        this.fileStorageUi.contextMenuPopup.style.display = "none";

        if (this.selectedItem.length === 0) {
            alert("삭제할 파일을 선택해주세요.")
            return;
        }

        if (confirm("확인을 누르면 파일이 삭제됩니다.") === false) {
            return;
        }

        let deleteFileNo = [];

        for (let i = 0; i < this.selectedItem.length; i++) {
            deleteFileNo.push(this.selectedItem[i].dataset.fileNo);
        }

        await this.fileStorageService.delete(this.uploadFolderNo, deleteFileNo);

        for (let i = 0; i < this.selectedItem.length; i++) {
            this.selectedItem[i].remove();
        }

        this.selectedItem = [];
    }

    clickSaveFile(e) {
        this.uploadFile.bind(this)(this.fileStorageUi.files.files);
        this.fileStorageUi.files.value = "";
    }

    async uploadFile(files) {
        await this.fileStorageService.upload(
            files,
            this.uploadFolderNo,
            (e) => {
                if (e.lengthComputable === false) {
                    console.log("Unable to compute progress information since the total size is unknown");
                    return false;
                }

                let percentage = Math.round((e.loaded / e.total) * 100);

                this.fileStorageUi.progressBar.value = percentage;
            },
            (e) => {
                this.fileStorageUi.progressBar.max = 100;
                this.fileStorageUi.progressBar.value = 0;
            },
            (e) => {
                this.fileStorageUi.progressBar.value = 100;
            }
        );

        await this._loadFileList();
    }

    async _loadFileList() {
        let fileList = await this.fileStorageService.getList(this.uploadFolderNo);
        this.fileStorageUi.setFileList(fileList, this.copyState, this.copyFileItem);
    }

    async _reloadFileList() {
        this.copyState = null;
        this.copyFileItem = [];

        this._loadFileList();
    }
}