import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, get, query, limitToLast } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import './Style.css'; // Import your CSS file

import dashPic from './images/dashboardIcon.png';
import profPic from './images/profileIcon.png';
import bankPic from './images/bankingIcon.png';
import budgetPic from './images/budgetIcon.png';
import stockPic from './images/stockIcon.png';
import settingPic from './images/settingsIcon.png';

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

const userId = "0901338"; // Use the provided user ID

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const TestDashboard = () => {

  useEffect(() => {
    calculateBalanceOfCheckingsAcc();
    calculateBalanceOfSavingsAcc();
    calculateBalanceOfblackCC();
    calculateBalanceOfsavingsCC();
    getTotalDepositsThisMonth();
    getTotalSpentThisMonth();
    displayRecentTransactions();
    updateFicoScore();
    generateFicoScoreGraph();
  }, []);

  function calculateBalanceOfCheckingsAcc() {
    const transactionsRef = ref(db, `${userId}/banking/accounts/CheckingsAcc/transactions`);
    let totalDeposit = 0;
    let totalSpent = 0;

    get(transactionsRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        // childSnapshot.key will be the "yyyy-mm-dd" date string
        const transaction = childSnapshot.val();
        if (transaction.type === 'deposit') {
          totalDeposit += parseFloat(transaction.amount);
        } else if (transaction.type === 'spent') {
          totalSpent += parseFloat(transaction.amount);
        }
      });

      const currentBalance = totalDeposit - totalSpent;
      document.getElementById('ChkAccbalance').textContent = currentBalance.toFixed(0);
    }).catch((error) => {
      console.error("Error fetching transactions:", error);
      document.getElementById('ChkAccbalance').textContent = "!!";
    });
  }

  function calculateBalanceOfSavingsAcc() {
    const transactionsRef = ref(db, `${userId}/banking/accounts/SavingsAcc/transactions`);
    let totalDeposit = 0;
    let totalSpent = 0;

    get(transactionsRef).then((snapshot) => {
      snapshot.forEach((childSnapshot) => {
        // childSnapshot.key will be the "yyyy-mm-dd" date string
        const transaction = childSnapshot.val();
        if (transaction.type === 'deposit') {
          totalDeposit += parseFloat(transaction.amount);
        } else if (transaction.type === 'spent') {
          totalSpent += parseFloat(transaction.amount);
        }
      });

      const currentBalance = totalDeposit - totalSpent;
      document.getElementById('SvnAccbalance').textContent = currentBalance.toFixed(0);
    }).catch((error) => {
      console.error("Error fetching transactions:", error);
      document.getElementById('SvnAccbalance').textContent = "!!";
    });
  }

  function calculateBalanceOfsavingsCC() {
    const transactionsRef = ref(db, `${userId}/banking/cards/SavingsCC/transactions`);
    let totalDeposit = 0;
    let totalSpent = 0;
  
    get(transactionsRef).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            // childSnapshot.key will be the "yyyy-mm-dd" date string
            const transaction = childSnapshot.val();
            if (transaction.type === 'deposit') {
                totalDeposit += parseFloat(transaction.amount);
            } else if (transaction.type === 'spent') {
                totalSpent += parseFloat(transaction.amount);
            }
        });
  
        const currentBalance = totalDeposit - totalSpent;
        document.getElementById('SavCCbalance').textContent = Math.abs(currentBalance).toFixed(0);
    }).catch((error) => {
        console.error("Error fetching transactions:", error);
        document.getElementById('SavCCbalance').textContent = "!!";
    });
  }

  function calculateBalanceOfblackCC() {
    const transactionsRef = ref(db, `${userId}/banking/cards/BlackCC/transactions`);
    let totalDeposit = 0;
    let totalSpent = 0;
  
    get(transactionsRef).then((snapshot) => {
        snapshot.forEach((childSnapshot) => {
            // childSnapshot.key will be the "yyyy-mm-dd" date string
            const transaction = childSnapshot.val();
            if (transaction.type === 'deposit') {
                totalDeposit += parseFloat(transaction.amount);
            } else if (transaction.type === 'spent') {
                totalSpent += parseFloat(transaction.amount);
            }
        });
  
        const currentBalance = totalDeposit - totalSpent;
        document.getElementById('BlkCCbalance').textContent = Math.abs(currentBalance).toFixed(0);
    }).catch((error) => {
        console.error("Error fetching transactions:", error);
        document.getElementById('BlkCCbalance').textContent = "!!";
    });
  }

  function isInCurrentMonth(transactionDate) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
    const [year, month] = transactionDate.split('-').map(Number);
    return year === currentYear && month === currentMonth;
  }
  
    function getTotalDepositsThisMonth() {
    const savingsTransactionsRef = ref(db, `${userId}/banking/accounts/SavingsAcc/transactions`);
    const checkingTransactionsRef = ref(db, `${userId}/banking/accounts/CheckingsAcc/transactions`);
    const receivedFundsRef = ref(db, `${userId}/SendReceive/ReceivedFunds`);
  
    let totalDeposits = 0;
  
    // Function to process snapshot and update the total deposits
    const processSnapshot = (snapshot) => {
        snapshot.forEach((childSnapshot) => {
            const transaction = childSnapshot.val();
            if (transaction.type === 'deposit' && isInCurrentMonth(childSnapshot.key)) {
                totalDeposits += parseFloat(transaction.amount);
            }
        });
  
        // Update the displayed total deposits with the latest value
        document.getElementById('totalDepositsThisMonth').textContent = totalDeposits.toFixed(0);
    };
  
    // Get Savings Account transactions
    get(savingsTransactionsRef).then(processSnapshot).catch((error) => {
        console.error("Error fetching savings transactions:", error);
    });
  
    // Get Checking Account transactions
    get(checkingTransactionsRef).then(processSnapshot).catch((error) => {
        console.error("Error fetching checking transactions:", error);
    });
  
    // Get Received Funds transactions
    get(receivedFundsRef).then(processSnapshot).catch((error) => {
        console.error("Error fetching received funds transactions:", error);
    });
  }

  function getTotalSpentThisMonth() {
    const savingsTransactionsRef = ref(db, `${userId}/banking/accounts/SavingsAcc/transactions`);
    const checkingTransactionsRef = ref(db, `${userId}/banking/accounts/CheckingsAcc/transactions`);
    const savingsCCTransactionsRef = ref(db, `${userId}/banking/cards/SavingsCC/transactions`);
    const blackCCTransactionsRef = ref(db, `${userId}/banking/cards/BlackCC/transactions`);
    const sendReceivedFundsRef = ref(db, `${userId}/SendReceive/SendFunds`);
  
    let totalSpent = 0;
  
    // Define an array of references to make the code DRY
    const refs = [savingsTransactionsRef, checkingTransactionsRef, savingsCCTransactionsRef, blackCCTransactionsRef, sendReceivedFundsRef];
  
    // Process each reference
    refs.forEach(ref => {
        get(ref).then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                const transaction = childSnapshot.val();
                if (transaction.type === 'spent' && isInCurrentMonth(childSnapshot.key)) {
                    totalSpent += parseFloat(transaction.amount);
                }
            });
  
            // Update total spent in HTML
            document.getElementById('totalSpentThisMonth').textContent = totalSpent.toFixed(0);
        });
    });
  }

  // Array to hold references for each account/card
const transactionRefs = [
  { type: 'CheckingsAcc', path: `${userId}/banking/accounts/CheckingsAcc/transactions` },
  { type: 'SavingsAcc', path: `${userId}/banking/accounts/SavingsAcc/transactions` },
  { type: 'SavingsCC', path: `${userId}/banking/cards/SavingsCC/transactions` },
  { type: 'BlackCC', path: `${userId}/banking/cards/BlackCC/transactions` }
];

function displayRecentTransactions() {
  const transactionsDiv = document.getElementById('recentTransactions');

  transactionRefs.forEach(({ type, path }) => {
      const recentTransactionsRef = query(ref(db, path), limitToLast(3));
      console.log("Hello 1");
      get(recentTransactionsRef).then((snapshot) => {
          console.log("Hello 2");
          if (snapshot.exists()) {
              console.log("Snapshot exists:", snapshot.exists()); // Add this line
              console.log("Hello 3");
              transactionsDiv.innerHTML += `<h3>${type}</h3>`;

              snapshot.forEach((childSnapshot) => {
                  console.log("ChildSnapshot key:", childSnapshot.key); // Log the key
                  console.log("ChildSnapshot value:", childSnapshot.val()); // Log the value
                  console.log("ChildSnapshot exists:", childSnapshot.exists()); // Log if it exists
                  console.log("Hello 4");
                  const date = childSnapshot.key;
                  const { name, amount } = childSnapshot.val();
                  console.log("Hello");
                  transactionsDiv.innerHTML +=
                      `<div class="transactionsRows2 transaction-entry2">
                        <p>
                            <span class="transaction-store transName2">${name}</span> <br> 
                            <span class="transaction-date transDate2">${date}</span>
                        </p>
                        <p>
                            <span class="transaction-amount transAmount2">$${amount}</span>
                        </p>
                    </div>`;
              });
          } else {
              transactionsDiv.innerHTML += `<p>No recent transactions for ${type}.</p>`;
          }
      }).catch((error) => {
          console.error(`Failed to fetch recent transactions for ${type}:`, error);
      });
  });
}

// Function to fetch and update FICO score
function updateFicoScore() {
  const scoresRef = ref(db, `${userId}/fico`);
  const recentScoreQuery = query(scoresRef, limitToLast(1));

  get(recentScoreQuery).then((snapshot) => {
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const score = childSnapshot.val(); // Assuming the value is directly the score
        const scoreDisplay = document.getElementById('scoreDisplay');
        const progressBar = document.getElementById('ficoScoreProgressBar');

        // Update the score display
        scoreDisplay.textContent = `${score}`;

        // Calculate the progress percentage
        const progressPercentage = ((score - 300) / (850 - 300)) * 250;
        progressBar.style.marginBottom = `${progressPercentage}px`;
      });
    } else {
      console.log("No scores available");
    }
  }).catch((error) => {
    console.error("Error fetching FICO score:", error);
  });
}

function generateFicoScoreGraph() {
  const scoresRef = ref(db, `${userId}/fico`);
  const recentScoresQuery = query(scoresRef, limitToLast(6));

  get(recentScoresQuery).then((snapshot) => {
    const scoresData = [];
    const labels = [];
    
    snapshot.forEach((childSnapshot) => {
      const score = childSnapshot.val();
      const originalDate = childSnapshot.key;

      const dateParts = originalDate.split('-');
      const year = dateParts[0];
      const month = dateParts[1];
      
      const formattedDate = `${month} ${year.substring(2)}`;
      
      scoresData.unshift(score);
      labels.unshift(formattedDate);
    });

    const chartCanvases = ['chart1'];

    chartCanvases.forEach((canvasId, index) => {
      const ctx = document.getElementById(canvasId).getContext('2d');
      new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `FICO Scores (past 6 months)`,
            data: scoresData,
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
            borderColor: 'rgba(255, 99, 32, 1)',
            borderWidth: 3
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: false
            }
          }
        }
      });
    });
  }).catch((error) => {
    console.error("Error fetching FICO scores:", error);
  });
}

  return (
    <div className="dashboard">
            {/* Navigation Bar */}
            <div className="navigationBar">
                {/* Profile Icon */}
                <div className="profileIcon navIconANDtxt">
                    <img className="navIcons" src={profPic} alt="" />
                    <Link className='navLinks' to="/profile">
                      <p>Profile</p>
                    </Link>
                </div>
                {/* Middle Icons */}
                <div className="middleIcons">
                    {/* Dashboard Icon */}
                    <div className="navIconANDtxt">
                        <img className="navIcons" src={dashPic} alt="" />
                        <Link className="navLinks" to="/dashboard">
                            <p>Dashboard</p>
                        </Link>
                    </div>
                    {/* Banking Icon */}
                    <div className="navIconANDtxt">
                      <img className="navIcons" src={bankPic} alt="" /> 
                        <Link className="navLinks" to="/banking">
                            <p>Banking</p>
                        </Link>
                    </div>
                    {/* Budget Icon */}
                    <div className="navIconANDtxt">
                      <img className="navIcons" src={budgetPic} alt="" /> 
                        <Link className='navLinks' to="/budgeting">
                            <p>Budgeting</p>
                        </Link>
                    </div>
                    {/* Stock Icon */}
                    <div className="navIconANDtxt">
                      <img className="navIcons" src={stockPic} alt="" /> 
                        <Link className='navLinks' to="/stocks">
                            <p>Stocks</p>
                        </Link>
                    </div>
                </div>
                {/* Settings Icon */}
                <div className="settingsIcon navIconANDtxt">
                    <img className="navIcons" src={settingPic} alt="" />
                      <Link className='navLinks' to="/backdoor">
                      <p>Settings</p>
                      </Link>
                </div>
            </div>
            {/* Dashboard Body Section */}
            <div className="dashBodySection">
                {/* Dashboard Numbers */}
                <div className="dashNumbersCont">
                    <div className="currentBalChk DashChildsOnd">
                        <p>Checkings (..4483) Balance</p>
                        <p className="balances"><span style={{fontSize: '80px'}}>$</span><span id="ChkAccbalance">--</span></p>
                    </div>
                    <div className="currentBalSav DashChildsOnd">
                        <p>Savings (...9958) Balance</p>
                        <p className="balances"><span style={{fontSize: '80px'}}>$</span><span id="SvnAccbalance">--</span></p>
                    </div>
                    <div class="currentBalCardSav DashChildsOnd">
                        <p>Savings Plus CC balance</p>
                        <p class="balances"><span style={{fontSize: '80px'}}>$</span><span id="SavCCbalance">--</span></p>
                    </div>
                    <div class="currentBalCardBlk DashChildsOnd">
                        <p>Black Platinum CC balance</p>
                        <p class="balances"><span style={{fontSize: '80px'}}>$</span><span id="BlkCCbalance">--</span></p>
                    </div>
                    <div class="TotalDepo DashChildsOnd">
                        <p>Total Deposit (April)</p>
                        <p class="balances"><span style={{fontSize: '80px'}}>$</span><span id="totalDepositsThisMonth">--</span></p>
                    </div>
                    <div class="totalSpent DashChildsOnd">
                        <p>Total Spent (April)</p>
                        <p class="balances"><span style={{fontSize: '80px'}}>$</span><span id="totalSpentThisMonth">--</span></p>
                    </div>
                </div>
                {/* Recent Transactions */}
                <div className="dashRecentTrans">
                    <p className="rtTxt">Recent Transactions</p>
                    <div className="mainDisplay2">
                        <div className="bankingScrollable2">
                            <div id="recentTransactions" className="transactionsRowsx2"></div>
                        </div>
                    </div>
                </div>
                {/* FICO Score */}
                <div className="ficoCont">
                    <div className="ficoScoreCont">
                        <p>FICO SCORE<br /><span id="scoreDisplay">--</span></p>
                    </div>
                    <div className="progress-container">
                        <div className="progress-bar" id="ficoScoreProgressBar"></div>
                    </div>
                    <div className="ficoChart">
                        <div id="charts">
                            <canvas id="chart1"></canvas>
                        </div>
                    </div>
                </div>
                {/* Bank Footer */}
                <div className="bankFooter">
                    <p>
                        {/* Add your bank footer content here */}
                        Disclosures - THIS Bank, N.A., and its affiliates offer investment products, which may include bank-managed accounts and custody, as part of its trust and fiduciary services. Other investment products and services, such as brokerage and advisory accounts, are offered through THIS Bank LLC, a member of FINRA and SIPC. Insurance products are made available through Chase Insurance Agency, Inc. (CIA), a licensed insurance agency, doing business as Chase Insurance Agency Services, Inc. in Florida. THIS Bank and CIA are affiliated companies under the common control of THIS Bank & Co. Products not available in all states. Please note that the privacy policy and security practices of the linked website may differ from those of THIS Bank, N.A., and its affiliates. It is recommended that customers review the privacy statements and security policies of any third-party websites accessed through this site. THIS Bank, N.A., does not guarantee or endorse the information, recommendations, products, or services offered on third-party sites. Investments in securities: Not FDIC Insured • No Bank Guarantee • May Lose Value. Investing in securities involves risks, and there is always the potential of losing money when you invest in securities. Before investing, consider your investment objectives and THIS Bank's charges and expenses. The investment products sold through THIS Bank and its affiliates are not insured by the FDIC, are not deposits or other obligations of, or guaranteed by, THIS Bank, and are subject to investment risks, including possible loss of the principal amount invested. All loan applications are subject to credit review and approval. Interest rates and terms may vary, and the approval of your loan is based on specific criteria, including your credit history, income, and other factors. THIS Bank is committed to adhering to a strict code of ethics and upholding the highest standards of trust and integrity. Potential conflicts of interest are identified and managed in accordance with our conflict of interest policies and procedures to ensure our clients' interests are protected at all times. For additional information, including details about our products, services, and fees, please contact a THIS Bank representative. By using THIS Bank's services, you agree to our Terms of Use and acknowledge you have read our Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
  );
}

export default TestDashboard;