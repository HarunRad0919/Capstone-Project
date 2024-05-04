import React, { useEffect } from 'react';
import './Style.css';
import { Link } from 'react-router-dom';
import { getDatabase, ref, get, query, limitToLast, onValue, set } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";

import dashPic from './images/dashboardIcon.png';
import profPic from './images/profileIcon.png';
import bankPic from './images/bankingIcon.png';
import budgetPic from './images/budgetIcon.png';
import stockPic from './images/stockIcon.png';
import settingPic from './images/settingsIcon.png';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDnbRlkPkCCgwndDEnd-1moJ8Se_1D35Fw",
    authDomain: "capstoneproject451-d50f7.firebaseapp.com",
    databaseURL: "https://capstoneproject451-d50f7-default-rtdb.firebaseio.com",
    projectId: "capstoneproject451-d50f7",
    storageBucket: "capstoneproject451-d50f7.appspot.com",
    messagingSenderId: "811306304777",
    appId: "1:811306304777:web:f2a1cdc1795f0d5fc1ffd8",
    measurementId: "G-79VHWNQ2EY"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase(app);
  
  const userId = "0901338";

function Backdoor() {

    useEffect(() => {
        document.getElementById('transactionDate').valueAsDate = new Date();
      }, []);

    function submitTransaction() {
        const transactionType = document.getElementById('transactionType').value;
        const name = document.getElementById('transactionName').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const date = document.getElementById('transactionDate').value || new Date().toISOString().split('T')[0]; // Use today's date if not specified
      
        // Assuming 'userId' is already defined in your scope
         // Replace this with the actual logic to retrieve user ID
      
        // Mapping the selected option to the database path
        const paths = {
            "CheckingsAcc_spent": `banking/accounts/CheckingsAcc/transactions/${date}`,
            "SavingsAcc_spent": `banking/accounts/SavingsAcc/transactions/${date}`,
            "CheckingsAcc_deposit": `banking/accounts/CheckingsAcc/transactions/${date}`,
            "SavingsAcc_deposit": `banking/accounts/SavingsAcc/transactions/${date}`,
            "SavingsCC_spent": `banking/cards/SavingsCC/transactions/${date}`,
            "BlackCC_spent": `banking/cards/BlackCC/transactions/${date}`,
            "SendFund_spent": `transactions/SendFund/${date}`,
            "ReceivedFund_deposit": `transactions/ReceivedFund/${date}`
        };
      
        const basePath = paths[transactionType];
        const fullDatabasePath = `${userId}/${basePath}`;
      
        // Construct the data object
        const transactionData = {
            type: transactionType.includes('_spent') ? 'spent' : 'deposit',
            name: name,
            amount: amount
        };
      
        // Writing the transaction data to the Firebase Realtime Database
        const transactionRef = ref(db, fullDatabasePath);
        set(transactionRef, transactionData).then(() => {
            console.log('Transaction saved successfully');
            // You can add any post-submission logic here (e.g., clear the form, show a success message)
        }).catch((error) => {
            console.error('Error saving transaction:', error);
        });
      }
      
      document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('transactionDate').valueAsDate = new Date();
    
        // Add event listener to the button instead of using inline onclick
        document.getElementById('submitTransactionButton').addEventListener('click', submitTransaction);
    });

    const toggleRandomDataForm = () => {
        const form = document.getElementById('randomDataForm');
        form.style.display = form.style.display === 'flex' ? 'none' : 'flex';
      }

    const generateRandomData = () => {
        const duration = parseInt(document.getElementById('duration').value, 10);
        const transactionsPerMonth = parseInt(document.getElementById('transactionsPerMonth').value, 10);
        const selectedOption = document.getElementById('randomTransactionType').selectedOptions[0];
        const transactionType = selectedOption.value;
        const transactionAction = selectedOption.getAttribute('data-type');
    
        for (let month = 0; month < duration; month++) {
          for (let transaction = 0; transaction < transactionsPerMonth; transaction++) {
            const date = getRandomDate(month);
            const name = getRandomName(transactionType, transactionAction);
            const isSpent = transactionAction === 'spent';
            const amount = getRandomAmount(isSpent);
    
            const basePath = determineBasePath(transactionType, date);
            const fullDatabasePath = `${userId}/${basePath}`;
    
            const transactionData = {
              type: transactionAction,
              name: name,
              amount: amount
            };
    
            const transactionRef = ref(db, fullDatabasePath);
            set(transactionRef, transactionData);
          }
        }
    
        alert('Random data added.');
      }

      const getRandomDate = (month) => {
        const date = new Date();
        date.setMonth(date.getMonth() - month, 1);
        const day = Math.floor(Math.random() * (28 - 1 + 1)) + 1;
        date.setDate(day);
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
      }
    
      const getRandomName = (transactionType, transactionAction) => {
        let names = [];
    
        const depositNames = ["DD", "9902948022", "252527737", "Refund"];
        const personNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
        const storeNames = ["Walmart", "Target", "Kroger", "Costco", "Home Depot", "Walgreens", "CVS Pharmacy", "Lowe's", "Best Buy", "Publix", "Aldi", "Dollar General", "Macy's", "Toe Transplant", "GymShark", "Subway", "Taco Bell", "Chick-fil-A", "Nike", "Apple Store"];
    
        if (transactionAction === "deposit") {
          if (transactionType === "ReceivedFund") {
            names = personNames;
          } else {
            names = depositNames;
          }
        } else {
          names = storeNames;
        }
    
        return names[Math.floor(Math.random() * names.length)];
      }
    
      const getRandomAmount = (isSpent) => {
        if (isSpent) return Math.floor(Math.random() * 50) + 1; // Spent: 1-50
        return Math.floor(Math.random() * 150) + 50; // Deposit: 50-200, ensuring deposit is more
      }
    
      const determineBasePath = (transactionType, date) => {
        let basePath;
        if (["CheckingsAcc", "SavingsAcc"].includes(transactionType)) {
          basePath = `banking/accounts/${transactionType}/transactions/${date}`;
        } else if (["SavingsCC", "BlackCC"].includes(transactionType)) {
          basePath = `banking/cards/${transactionType}/transactions/${date}`;
        } else {
          basePath = `SendReceive/${transactionType}/${date}`;
        }
        return basePath;
      }

  return (
    <div className="BackDoorBody">

      <a href="index.html">
      <div className="navigationBar">
                <div className="profileIcon navIconANDtxt">
                    <img className="navIcons" src={profPic} alt="" />
                    <p>Profile</p>
                </div>
                <div className="middleIcons">
                    <div className="navIconANDtxt">
                        <img className="navIcons" src={dashPic} alt="" />
                        <a className="navLinks" href="index.html">
                        <Link className="navLinks" to="/dashboard">
                            <p>Dashboard</p>
                        </Link>
                        </a>
                    </div>
                    <div className="navIconANDtxt">
                        <img className="navIcons" src={bankPic} alt="" />
                        <a className="navLinks" href="banking.html">
                        <Link className="navLinks" to="/banking">
                            <p>Banking</p>
                        </Link>
                        </a>
                    </div>
                    <div className="navIconANDtxt">
                        <img className="navIcons" src={budgetPic} alt="" />
                        <a className="navLinks" href="budget.html">
                        <Link className='navLinks' to="/budgeting">
                            <p>Budgeting</p>
                        </Link>
                        </a>
                    </div>
                    <div className="navIconANDtxt">
                        <img className="navIcons" src={stockPic} alt="" />
                        <a className="navLinks" href="stocks.html">
                        <Link className='navLinks' to="/stocks">
                            <p>Stocks</p>
                        </Link>
                        </a>
                    </div>
                </div>
                <div className="settingsIcon navIconANDtxt">
                    <img className="navIcons" src={settingPic} alt="" />
                    <Link className='navLinks' to="/backdoor">
                      <p>Settings</p>
                      </Link>
                </div>
            </div>
      </a>
      <h1 style={{ fontFamily: 'Bebas Neue' }}>BackDoor</h1>

      <form id="transactionForm">
        <select id="transactionType">
          <option value="CheckingsAcc_spent">Checkings Acc (spent)</option>
          <option value="SavingsAcc_spent">Savings Acc (spent)</option>
          <option value="CheckingsAcc_deposit">Checkings Acc (deposit)</option>
          <option value="SavingsAcc_deposit">Savings Acc (deposit)</option>
          <option value="SavingsCC_spent">SavingsCC (spent)</option>
          <option value="BlackCC_spent">BlackCC (spent)</option>
          <option value="SendFund_spent">SendFund (spent)</option>
          <option value="ReceivedFund_deposit">ReceivedFund (deposit)</option>
        </select>
        <input type="text" id="transactionName" placeholder="Name" />
        <input type="number" id="transactionAmount" placeholder="Amount" />
        <input type="date" id="transactionDate" value="" />
        <button type="button" id="submitTransactionButton" onClick={submitTransaction}>Submit</button>
      </form>

      <button type="button" id="addDataButton" onClick={toggleRandomDataForm}>Add Bulk Data</button>

      <div id="randomDataForm" style={{ display: 'none' }}>
        <select id="duration">
          <option value="1">1 month</option>
          <option value="2">2 months</option>
          <option value="4">4 months</option>
          <option value="6">6 months</option>
          <option value="8">8 months</option>
          <option value="10">10 months</option>
          <option value="12">12 months</option>
        </select>
        <select id="transactionsPerMonth">
          <option value="2">2 transactions/month</option>
          <option value="5">5 transactions/month</option>
          <option value="10">10 transactions/month</option>
          <option value="15">15 transactions/month</option>
          <option value="20">20 transactions/month</option>
        </select>
        <select id="randomTransactionType">
          <option value="CheckingsAcc" data-type="spent">Checkings Acc (spent)</option>
          <option value="SavingsAcc" data-type="spent">Savings Acc (spent)</option>
          <option value="CheckingsAcc" data-type="deposit">Checkings Acc (deposit)</option>
          <option value="SavingsAcc" data-type="deposit">Savings Acc (deposit)</option>
          <option value="SavingsCC" data-type="spent">SavingsCC (spent)</option>
          <option value="BlackCC" data-type="spent">BlackCC (spent)</option>
          <option value="SendFund" data-type="spent">SendFund (spent)</option>
          <option value="ReceivedFund" data-type="deposit">ReceivedFund (deposit)</option>
        </select>

        <button type="button" id="submitRandomDataButton" onClick={generateRandomData}>GENERATE</button>
      </div>
    </div>
  );
}

export default Backdoor;