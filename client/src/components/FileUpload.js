import { useState } from "react";
import axios from "axios";
import "./FileUpload.css";

const FileUpload = ({ contract, provider, account }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("No File Selected");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (file) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        const resFile = await axios({
          method: "post",
          url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers: {
            pinata_api_key: `6f275e330800d825a0e3`,
            pinata_secret_api_key: `1ac664f926269a04a4e1c702dac79f71114fea39fbce1872ef667f7c558296f4`,
            "Content-Type": "multipart/form-data",
          },
        });
        const ImgHash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
        contract.add(account,ImgHash);
        alert("Successfully Image Uploaded");
        setFileName("No image selected");
        setFile(null);
      } catch (e) {
        alert("Unable to upload Image on Pinata");
      }
    }
    // alert("Successfully Image Uploaded");
    // setFileName("No image selected");
    // setFile(null);
  };
  const retrieveFile = (e) => {
    const data =e.target.files[0];
    const reader =new window.FileReader();
    reader.readAsArrayBuffer(data);
    reader.onloadend =()=>{
        setFile(e.target.files[0]);
    };
    setFileName(e.target.files[0].name);
    e.preventDefault();
  };
  return (
    <div className="top">
      <form className="form" onSubmit={handleSubmit}>
        <label htmlFor="file-upload" className="choose">
          Choose Image
        </label>
        <input
          disabled={!account}
          type="file"
          id="file-upload"
          name="data"
          onChange={retrieveFile}
        />
        <span className="textArea">Image:{fileName}</span>
        <button type="submit" className="upload"  disabled={!file}>
          Upload File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
