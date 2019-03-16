import axios from "axios";

export default file => {
    const data = new FormData();
    data.append("file", file, file.name);

    return axios.post(`/api/upload_media`, data, {
        onUploadProgress: ProgressEvent => {
            //this.setState({
            //    loaded: (ProgressEvent.loaded / ProgressEvent.total) * 100
            //});
        }
    });
};
