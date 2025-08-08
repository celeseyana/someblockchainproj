import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import FoodSupplyChain from '../artifacts/contracts/FoodSupplyChain.sol/FoodSupplyChain.json';
const contractAddress = import.meta.env.VITE_ADDRESS_KEY;

export default function CreateItem() {
  const [contract, setContract] = useState(null);
  const [name, setName] = useState('');
  const [origin, setOrigin] = useState('');
  const [metadataURI, setMetadataURI] = useState('');
  const [txStatus, setTxStatus] = useState('');
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    async function initContract() {
      if (window.ethereum) {
        try {
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const foodContract = new ethers.Contract(contractAddress, FoodSupplyChain.abi, signer);
          setContract(foodContract);
        } catch (error) {
          console.error('Error connecting to contract:', error);
        }
      }
    }

    // Set user role from localStorage
    setUserRole(localStorage.getItem('role'));

    initContract();
  }, []);

  const handleCreateItem = async (e) => {
    e.preventDefault();
    if (!contract) return;

    try {
      const username = localStorage.getItem('username') || 'Unknown User';
      const tx = await contract.createItem(name, origin, metadataURI, username);
      setTxStatus('⏳ Transaction sent... Waiting for confirmation');
      await tx.wait();
      setTxStatus('✅ Item created successfully!');
      setName('');
      setOrigin('');
      setMetadataURI('');
    } catch (err) {
      console.error(err);
      setTxStatus('❌ Error creating item');
    }
  };

  if (userRole !== 'manufacturer') {
    return (
      <div className="box has-background-dark has-text-light mb-5">
        <h2 className="title is-5">Create New Food Item</h2>
        <p className="has-text-danger">Only manufacturers can create items.</p>
      </div>
    );
  }

  return (
    <div className="box has-background-dark has-text-light mb-5">
      <h2 className="title is-5">Create New Food Item</h2>
      <form onSubmit={handleCreateItem}>
        <div className="field">
          <label className="label has-text-white">Name</label>
          <input className="input" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="field">
          <label className="label has-text-white">Origin</label>
          <input className="input" type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} required />
        </div>

        <div className="field">
          <label className="label has-text-white">Metadata URI (IPFS optional)</label>
          <input className="input" type="text" value={metadataURI} onChange={(e) => setMetadataURI(e.target.value)} />
        </div>

        <div className="field mt-4">
          <button className="button is-link" type="submit">Create Item</button>
        </div>

        {txStatus && <p className="mt-2">{txStatus}</p>}
      </form>
    </div>
  );
}
