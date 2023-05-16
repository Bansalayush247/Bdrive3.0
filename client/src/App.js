import Upload from "./artifacts/contracts/Upload.sol/Upload.json";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import FileUpload from "./components/FileUpload";
import Display from "./components/Display";
import Modal from "./components/Modal";
import "./App.css";

function App() {
  const [account, setAccount] = useState("");
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    //provider is used to only read from blockchain

    const loadProvider = async () => {
      if (provider) {
        window.ethereum.on("chainChanged", () => {
          window.location.reload();
        });

        window.ethereum.on("accountsChanged", () => {
          window.location.reload();
        });
        await provider.send("eth_requestAccounts", []);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        setAccount(address);
        let contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
        const contract = new ethers.Contract(
          contractAddress,
          Upload.abi,
          signer
        );
        setContract(contract);
        setProvider(provider);
      } else {
        console.error("metamask is not installed");
      }
    };
    provider && loadProvider();
  }, []);
  return (
    <>
    {!modalOpen && (<button className="share" onClick={()=>setModalOpen(true)}>Share</button>)}
    {modalOpen && (<Modal setModalOpen={setModalOpen} contract={contract}></Modal>)}
    <div className="App">
      <h1 style={{ color: "maroon" }}>Bdrive 3.0</h1>
      <div className='bg'></div>
      <div className='bg bg2'></div>
      <div className='bg bg3'></div>
      <p style={{color:'maroon'}}>
        Account : {account?account:"Not Connected"}
      </p>
      <FileUpload account={account} contract={contract} provider={provider}/>
      <Display account={account} contract={contract} />
    </div>
    </>
  );
}

export default App;
