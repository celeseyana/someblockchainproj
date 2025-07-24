import { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import FoodSupplyChain from '../artifacts/contracts/FoodSupplyChain.sol/FoodSupplyChain.json';

const contractAddress = import.meta.env.VITE_ADDRESS_KEY;

export default function ItemList() {
  const [contract, setContract] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State enum mapping for display
  const stateNames = {
    0: 'Harvested',
    1: 'Processed', 
    2: 'Packed',
    3: 'Shipped',
    4: 'Received',
    5: 'Sold'
  };

  const stateColors = {
    0: 'is-success',
    1: 'is-info',
    2: 'is-warning', 
    3: 'is-primary',
    4: 'is-link',
    5: 'is-dark'
  };

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
          setError('Failed to connect to contract');
          setLoading(false);
        }
      } else {
        setError('MetaMask not detected');
        setLoading(false);
      }
    }
    initContract();
  }, []);

  useEffect(() => {
    async function fetchItems() {
      if (!contract) return;
      
      try {
        setLoading(true);
        
        // Get total item count
        const itemCount = await contract.itemCount();
        const itemCountNum = Number(itemCount);
        
        if (itemCountNum === 0) {
          setItems([]);
          setLoading(false);
          return;
        }

        // Fetch all items
        const itemPromises = [];
        for (let i = 1; i <= itemCountNum; i++) {
          itemPromises.push(contract.getItem(i));
        }
        
        const fetchedItems = await Promise.all(itemPromises);
        
        // Format items for display
        const formattedItems = fetchedItems.map((item, index) => ({
          id: Number(item.id),
          name: item.name,
          origin: item.origin,
          currentOwner: item.currentOwner,
          state: Number(item.state),
          metadataURI: item.metadataURI
        }));
        
        setItems(formattedItems);
        setError('');
      } catch (err) {
        console.error('Error fetching items:', err);
        setError('Failed to fetch items from blockchain');
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [contract]);

  const handleAdvanceState = async (itemId) => {
    if (!contract) return;
    
    try {
      const tx = await contract.advanceState(itemId);
      setLoading(true);
      await tx.wait();
      
      // Refresh items after state change
      const itemCount = await contract.itemCount();
      const itemCountNum = Number(itemCount);
      
      const itemPromises = [];
      for (let i = 1; i <= itemCountNum; i++) {
        itemPromises.push(contract.getItem(i));
      }
      
      const fetchedItems = await Promise.all(itemPromises);
      const formattedItems = fetchedItems.map((item) => ({
        id: Number(item.id),
        name: item.name,
        origin: item.origin,
        currentOwner: item.currentOwner,
        state: Number(item.state),
        metadataURI: item.metadataURI
      }));
      
      setItems(formattedItems);
      setLoading(false);
    } catch (err) {
      console.error('Error advancing state:', err);
      setError('Failed to advance item state');
      setLoading(false);
    }
  };

  const truncateAddress = (address) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="box has-background-dark has-text-light">
        <h2 className="title is-5 has-text-white">Food Supply Chain Items</h2>
        <div className="has-text-centered">
          <div className="is-loading"></div>
          <p>Loading items from blockchain...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="box has-background-dark has-text-light">
        <h2 className="title is-5 has-text-white">Food Supply Chain Items</h2>
        <div className="notification is-danger">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="box has-background-dark has-text-light">
      <h2 className="title is-5 has-text-white">Food Supply Chain Items</h2>
      
      {items.length === 0 ? (
        <p className="has-text-grey">No items created yet. Create your first item to see it here!</p>
      ) : (
        <div className="columns is-multiline">
          {items.map((item) => (
            <div key={item.id} className="column is-full">
              <div className="card has-background-grey-dark">
                <div className="card-content">
                  <div className="media">
                    <div className="media-content">
                      <p className="title is-6 has-text-white">#{item.id} - {item.name}</p>
                      <p className="subtitle is-7 has-text-grey">Origin: {item.origin}</p>
                    </div>
                    <div className="media-right">
                      <span className={`tag ${stateColors[item.state]}`}>
                        {stateNames[item.state]}
                      </span>
                    </div>
                  </div>
                  
                  <div className="content">
                    <p className="is-size-7 has-text-grey">
                      <strong>Owner:</strong> {truncateAddress(item.currentOwner)}
                    </p>
                    
                    {item.metadataURI && (
                      <p className="is-size-7 has-text-grey">
                        <strong>Metadata:</strong> 
                        <a href={item.metadataURI} target="_blank" rel="noopener noreferrer" className="has-text-link">
                          View Metadata
                        </a>
                      </p>
                    )}
                    
                    {item.state < 5 && (
                      <div className="field is-grouped mt-3">
                        <div className="control">
                          <button 
                            className="button is-small is-primary"
                            onClick={() => handleAdvanceState(item.id)}
                          >
                            Advance to {stateNames[item.state + 1]}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}