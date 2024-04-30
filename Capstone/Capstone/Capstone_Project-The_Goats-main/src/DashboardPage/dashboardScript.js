// Import Chart.js using ES module
import Chart from 'https://cdn.jsdelivr.net/npm/chart.js';

// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, get, query,limitToLast } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";

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

const userId = "0901338"; // Use the provided user ID

// Function to fetch transactions and calculate the balance of checkingsAcc
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

// Function to fetch transactions and calculate the balance of savingsAcc
function calculateBalanceOfsavingsAcc() {
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

// Function to fetch transactions and calculate the balance of savingsCC
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

// Function to fetch transactions and calculate the balance of blackCC
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

// Call calculateBalance when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', calculateBalanceOfCheckingsAcc);
document.addEventListener('DOMContentLoaded', calculateBalanceOfsavingsAcc);
document.addEventListener('DOMContentLoaded', calculateBalanceOfsavingsCC);
document.addEventListener('DOMContentLoaded', calculateBalanceOfblackCC);











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

// Helper function to check if the transaction is in the current month
function isInCurrentMonth(transactionDate) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1; // JavaScript months are 0-indexed
  const [year, month] = transactionDate.split('-').map(Number);
  return year === currentYear && month === currentMonth;
}



// Function to get the total of all expenditures for the current month
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

// Call these functions when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  getTotalDepositsThisMonth();
  getTotalSpentThisMonth();
});












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
    
    get(recentTransactionsRef).then((snapshot) => {
      if (snapshot.exists()) {
        transactionsDiv.innerHTML += `<h3>${type}</h3>`;
        
        snapshot.forEach((childSnapshot) => {
          const date = childSnapshot.key;
          const { name, amount } = childSnapshot.val();


          transactionsDiv.innerHTML += `
          <div class="transactionsRows2 transaction-entry2">
              <p>
                  <span class="transaction-store transName2">${name}</span> <br> 
                  <span class="transaction-date transDate2">${date}</span>
              </p>
              <p>
                  <span class="transaction-amount transAmount2">$${amount}</span>
              </p>
          </div>
      `;






        });
      } else {
        transactionsDiv.innerHTML += `<p>No recent transactions for ${type}.</p>`;
      }
    }).catch((error) => {
      console.error(`Failed to fetch recent transactions for ${type}:`, error);
    });
  });
}

// Call the function to display recent transactions
displayRecentTransactions();




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

updateFicoScore();







document.addEventListener('DOMContentLoaded', function() {
  // Assuming Firebase has been initialized and configured
  const scoresRef = ref(db, `${userId}/fico`);
  const recentScoresQuery = query(scoresRef, limitToLast(6)); // Adjust number as needed

  get(recentScoresQuery).then((snapshot) => {
      const scoresData = [];
      const labels = []; // Assuming dates are your labels
      
      snapshot.forEach((childSnapshot) => {
        const score = childSnapshot.val(); // Assuming val() gives the score directly
        const originalDate = childSnapshot.key; // 'yyyy-mm-dd'
        
        // Parse the original date string
        const dateParts = originalDate.split('-'); // Split the date into parts
        const year = dateParts[0];
        const month = dateParts[1];
        
        // Format the date as 'mm yy' (e.g., '04 21')
        const formattedDate = `${month} ${year.substring(2)}`;
        
        // Use unshift to add to the beginning of the arrays
        scoresData.unshift(score);
        labels.unshift(formattedDate);
    });

      // Assuming each canvas is for a different aspect of the FICO score data
      const chartCanvases = [
          'chart1'
      ];

      chartCanvases.forEach((canvasId, index) => {
          // Here you would adjust each dataset and options for what each chart represents
          const ctx = document.getElementById(canvasId).getContext('2d');
          new Chart(ctx, {
              type: 'line', // or 'bar', 'radar', etc., depending on your data
              data: {
                  labels: labels,
                  datasets: [{
                      label: `FICO Scores (past 6 months)`,
                      data: scoresData, // Use the same data for all for example purposes
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      borderColor: 'rgba(255, 99, 32, 1)',
                      borderWidth: 3
                  }]
              },
              options: {
                  scales: {
                      y: {
                          beginAtZero: false // Set to true if you want the scale to start at zero
                      }
                  }
              }
          });
      });
  }).catch((error) => {
      console.error("Error fetching FICO scores:", error);
  });
});
