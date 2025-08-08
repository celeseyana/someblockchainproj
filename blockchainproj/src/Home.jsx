// App.jsx
import 'bulma/css/bulma.min.css';
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import FoodSupplyChain from '../artifacts/contracts/FoodSupplyChain.sol/FoodSupplyChain.json';
const contractAddress = import.meta.env.VITE_ADDRESS_KEY;

async function searchBlockchainItems(query) {
  if (!query) return [];
  
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const contract = new ethers.Contract(contractAddress, FoodSupplyChain.abi, provider);

    // Get total items count
    const itemCount = await contract.itemCount();
    
    // Fetch all items
    const items = await Promise.all(
      Array.from({ length: Number(itemCount) }, (_, i) => i + 1).map(async (id) => {
        try {
          const item = await contract.getItem(id);
          return {
            id: item.id.toString(),
            name: item.name,
            origin: item.origin,
            currentOwner: item.currentOwner,
            state: ['Harvested', 'Processed', 'Packed', 'Shipped', 'Received', 'Sold'][Number(item.state)],
            metadataURI: item.metadataURI
          };
        } catch (err) {
          console.error(`Error fetching item ${id}:`, err);
          return null;
        }
      })
    );

    // Filter items based on search query
    return items
      .filter(item => item !== null)
      .filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.origin.toLowerCase().includes(query.toLowerCase()) ||
        item.id.includes(query)
      );
  } catch (err) {
    console.error('Error searching blockchain:', err);
    return [];
  }
}

export default function App() {
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [contract, setContract] = useState(null);

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
    initContract();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setSearching(true);
    const items = await searchBlockchainItems(search);
    setResults(items);
    setSearching(false);
  };

  return (
    <div className="section">
      <div className="container">
        <div className="mb-5">
          <h1 className="title is-4">IBM FoodTrust Clone</h1>
          <p className="subtitle is-6">
          </p>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-5">
          <div className="field has-addons">
            <div className="control is-expanded">
              <input
                className="input"
                type="text"
                placeholder="Search items by name or lot..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <div className="control">
              <button className="button is-link" type="submit" disabled={searching}>
                {searching ? 'Searching...' : 'Search'}
              </button>
            </div>
          </div>
        </form>

        {/* Only show dashboard and timeline if there are search results */}
        {results.length > 0 && (
          <>
            <div className="box mb-5">
              <h2 className="title is-6">Search Results</h2>
              <ul>
                {results.map(item => (
                  <li key={item.id}>
                    <strong>{item.name}</strong> (Origin: {item.origin})
                  </li>
                ))}
              </ul>
            </div>

            <div className="box mb-5">
              <h2 className="title is-6 mb-4">Supply Chain Progress</h2>
              {results.map(item => (
                <div key={item.id} className="mb-5">
                  <p className="mb-2"><strong>{item.name}</strong> - Current State: <span className="tag is-info">{item.state}</span></p>
                  <div className="is-flex" style={{ position: 'relative' }}>
                    {['Harvested', 'Processed', 'Packed', 'Shipped', 'Received', 'Sold'].map((state, index) => {
                      const isCompleted = ['Harvested', 'Processed', 'Packed', 'Shipped', 'Received', 'Sold']
                        .indexOf(item.state) >= index;
                      const isCurrent = item.state === state;
                      
                      return (
                        <div 
                          key={state} 
                          className="is-flex is-flex-direction-column is-align-items-center" 
                          style={{ flex: 1, position: 'relative' }}
                        >
                          <div 
                            className={`circle ${isCompleted ? 'has-background-success' : 'has-background-grey-light'} 
                              ${isCurrent ? 'is-current' : ''}`}
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              marginBottom: '8px',
                              zIndex: 1,
                              border: isCurrent ? '3px solid #3298dc' : 'none'
                            }}
                          />
                          <p className="is-size-7 has-text-centered" style={{ maxWidth: '80px' }}>{state}</p>
                          {index < 5 && (
                            <div 
                              className={isCompleted ? 'has-background-success' : 'has-background-grey-light'}
                              style={{
                                position: 'absolute',
                                height: '2px',
                                top: '9px',
                                left: '50%',
                                right: '-50%',
                                zIndex: 0
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            
          </>
        )}
      </div>
    </div>
  );
}
