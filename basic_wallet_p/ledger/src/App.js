import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Moment from 'react-moment';

function App() {
  const [chain, setChain] = useState([])
  const [id, setId] = useState('')
  const [balance, setBalance] = useState("n/a")

  const fetchChain = async () => {
    await axios.get('http://localhost:5000/chain')
      .then(res => {
        setChain(res.data.chain)
        setBalance("n/a")
      })
      .catch(err => console.error(err))
  }

  const getBalance = id => {
    let total = 0;

    chain.forEach(block => {
      block.transactions.forEach(transaction => {
        if (transaction.recipient === id) {
          return total += transaction.amount
        }
  
        if (transaction.sender === id) {
          return total -= transaction.amount
        }
      })
    })

    setBalance(total)
  }

  const handleChange = e => {
    setId(e.target.value);
  }

  const filterChain = id => {
    const filtered = chain.filter(block => {
      if (!block.transactions.length) {
        return false
      } else {
        let match = false;
        block.transactions.map(transaction => {
          if (transaction.recipient === id) {
            match = true;
          }
        })
        return match;
      }
    })

    if (!filtered.length) {
      alert("Could not find transactions including the provided ID")
    } else {
      getBalance(id);
      setChain(filtered);
    }
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (id.trim() === "") {
      alert("Please provide a valid ID")
    } else {
      filterChain(id)
    }
  }

  useEffect(() => {
    fetchChain();
  }, [])

  return (
    <div className="App">
      <div className="form">
        <form onSubmit={handleSubmit}>
          <h2>Recipient ID</h2>
          <label>
            ID:
            <input type="text" value={id} onChange={handleChange} />
          </label>
          <input type="submit" value="Filter by ID" />
        </form>
        <button onClick={fetchChain}>Reset</button>
      </div>
      <div className="display">
        {chain.length ? (
          <div className="list">
            <h3>Coin balance: {balance}</h3>
            <h3># blocks: {chain.length}</h3>
            {chain.map(block => {
              if (block.transactions[0]) {
                return (
                  <div key={block.previous_hash}>
                    <h4>Amount: {block.transactions[0].amount}</h4>
                    <h4>Sender: {block.transactions[0].sender}</h4>
                    <h4>Recipient: {block.transactions[0].recipient}</h4>
                    <h6><Moment unix format="MM/DD/YYYY HH:mm">{block.timestamp}</Moment></h6>
                  </div>
                )
              }
            })}
          </div>
        ): null}
      </div>
    </div>
  );
}

export default App;
