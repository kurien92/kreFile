function ajax(url, method, formData, eventListener, option) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();

        let loadDone = eventListener.loadDone || function () { };
        let loadFail = eventListener.loadFail || function () { };

        xhr.upload.onprogress = eventListener.uploadProgress || function () { };
        xhr.upload.onloadstart = eventListener.uploadLoadstart || function () { };
        xhr.upload.onloadend = eventListener.uploadLoadend || function () { };

        xhr.onload = () => {
            let data = null;

            try {
                data = JSON.parse(xhr.responseText);
            } catch (err) {
                return loadFail(null, xhr);
            }

            if (xhr.status === 200 || xhr.status === 201) {
                return loadDone(data, xhr);
            } else {
                return loadFail(data, xhr);
            }
        }

        xhr.open(method, url);

        xhr.send(formData);
    });
}