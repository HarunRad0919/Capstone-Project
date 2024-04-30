// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, onValue, set, get } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";


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



// -------------------------------------------------------------------------


const userId = "0901338";



// Define the reference to the checking account's transactions
const transactionsRef = ref(db, `${userId}/banking/accounts/CheckingsAcc/transactions`);

// Function to update the transactions in the HTML
function updateTransactions(snapshot) {
    const transactionsDiv = document.getElementById('transactions');
    transactionsDiv.innerHTML = ''; // Clear existing transactions
    
    snapshot.forEach((transactionSnapshot) => {
        const date = transactionSnapshot.key; // 'yyyy-mm-dd' which is the date of the transaction
        const transactionDetails = transactionSnapshot.val(); // transaction details

        // Construct the transaction entry with the details
        transactionsDiv.innerHTML += `
            <div class="transactionsRows transaction-entry">
                <p>
                    <span class="transaction-store transName">${transactionDetails.name}</span> <br> 
                    <span class="transaction-date transDate">${date}</span>
                </p>
                <p>
                    <span class="transaction-amount transAmount">$${transactionDetails.amount}</span>
                </p>
            </div>
        `;
    });
}

// Listen for changes to the transactions data
onValue(transactionsRef, (snapshot) => {
    updateTransactions(snapshot);
});

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
      document.getElementById('ChkAccbalance').textContent = currentBalance.toFixed(2);
  }).catch((error) => {
      console.error("Error fetching transactions:", error);
      document.getElementById('ChkAccbalance').textContent = "!!";
  });
}

document.addEventListener('DOMContentLoaded', calculateBalanceOfCheckingsAcc);

function getBalanceOfCheckingsAcc(callback) {
  const transactionsRef = ref(db, `${userId}/banking/accounts/CheckingsAcc/transactions`);
  let totalDeposit = 0;
  let totalSpent = 0;

  get(transactionsRef).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const transaction = childSnapshot.val();
      if (transaction.type === 'deposit') {
        totalDeposit += parseFloat(transaction.amount);
      } else if (transaction.type === 'spent') {
        totalSpent += parseFloat(transaction.amount);
      }
    });

    const currentBalance = totalDeposit - totalSpent;
    callback(currentBalance); // Use a callback to handle the asynchronous nature of get()
  }).catch((error) => {
    console.error("Error fetching transactions:", error);
    callback(0); // Call the callback with 0 in case of an error
  });
}

function transferFunds() {
  const amountToTransfer = parseFloat(document.getElementById('ChkAccamount').value);

  // Call getBalanceOfCheckingsAcc and pass a callback function that performs the transfer
  getBalanceOfCheckingsAcc(currentBalance => {
    if (amountToTransfer > currentBalance) {
      alert('Insufficient funds. Please enter an amount less than the current balance.');
      return;
    }

    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Define the transaction references
    const checkingTransactionRef = ref(db, `${userId}/banking/accounts/CheckingsAcc/transactions/${date}`);
    const savingsTransactionRef = ref(db, `${userId}/banking/accounts/SavingsAcc/transactions/${date}`);

    // Prepare the data for CheckingsAcc
    const checkingTransactionData = {
      name: 'Fund Transfered to Savings',
      amount: amountToTransfer,
      type: 'spent'
    };

    // Prepare the data for SavingsAcc
    const savingsTransactionData = {
      name: 'Fund Received from Checking',
      amount: amountToTransfer,
      type: 'deposit'
    };

    // Perform the transactions
    set(checkingTransactionRef, checkingTransactionData);
    set(savingsTransactionRef, savingsTransactionData);

    // Confirm the transfer
    console.log('Transfer completed successfully');
  });
}

document.getElementById('chkAcctransferButton').addEventListener('click', transferFunds);











// Define the reference to the savings account's transactions
const SavAcctransactionsRef = ref(db, `${userId}/banking/accounts/SavingsAcc/transactions`);

// Function to update the transactions in the HTML
function updateSavingsAccTransactions(snapshot) {
    const transactionsDiv = document.getElementById('Savingstransactions');
    transactionsDiv.innerHTML = ''; // Clear existing transactions
    
    snapshot.forEach((transactionSnapshot) => {
        const date = transactionSnapshot.key; // 'yyyy-mm-dd' which is the date of the transaction
        const transactionDetails = transactionSnapshot.val(); // transaction details

        // Construct the transaction entry with the details
        transactionsDiv.innerHTML += `
            <div class="transactionsRows transaction-entry">
                <p>
                    <span class="transaction-store transName">${transactionDetails.name}</span> <br> 
                    <span class="transaction-date transDate">${date}</span>
                </p>
                <p>
                    <span class="transaction-amount transAmount">$${transactionDetails.amount}</span>
                </p>
            </div>
        `;
    });
}

// Listen for changes to the transactions data
onValue(SavAcctransactionsRef, (snapshot) => {
  updateSavingsAccTransactions(snapshot);
});


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
      document.getElementById('SvnAccbalance').textContent = currentBalance.toFixed(2);
  }).catch((error) => {
      console.error("Error fetching transactions:", error);
      document.getElementById('SvnAccbalance').textContent = "!!";
  });
}
document.addEventListener('DOMContentLoaded', calculateBalanceOfsavingsAcc);









function getBalanceOfSavingsAcc(callback) {
  const transactionsRef = ref(db, `${userId}/banking/accounts/SavingsAcc/transactions`);
  let totalDeposit = 0;
  let totalSpent = 0;

  get(transactionsRef).then((snapshot) => {
    snapshot.forEach((childSnapshot) => {
      const transaction = childSnapshot.val();
      if (transaction.type === 'deposit') {
        totalDeposit += parseFloat(transaction.amount);
      } else if (transaction.type === 'spent') {
        totalSpent += parseFloat(transaction.amount);
      }
    });

    const currentBalance = totalDeposit - totalSpent;
    callback(currentBalance); // Use a callback to handle the asynchronous nature of get()
  }).catch((error) => {
    console.error("Error fetching transactions:", error);
    callback(0); // Call the callback with 0 in case of an error
  });
}

function SavAcctransferFunds() {
  const amountToTransfer = parseFloat(document.getElementById('SavAccamount').value);

  // Call getBalanceOfCheckingsAcc and pass a callback function that performs the transfer
  getBalanceOfSavingsAcc(currentBalance => {
    if (amountToTransfer > currentBalance) {
      alert('Insufficient funds. Please enter an amount less than the current balance.');
      return;
    }

    const date = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format

    // Define the transaction references
    const checkingTransactionRef = ref(db, `${userId}/banking/accounts/CheckingsAcc/transactions/${date}`);
    const savingsTransactionRef = ref(db, `${userId}/banking/accounts/SavingsAcc/transactions/${date}`);

    // Prepare the data for CheckingsAcc
    const checkingTransactionData = {
      name: 'Fund Received from Savings',
      amount: amountToTransfer,
      type: 'deposit'
    };

    // Prepare the data for SavingsAcc
    const savingsTransactionData = {
      name: 'Fund Transfered to Checking',
      amount: amountToTransfer,
      type: 'spent'
    };

    // Perform the transactions
    set(checkingTransactionRef, checkingTransactionData);
    set(savingsTransactionRef, savingsTransactionData);

    // Confirm the transfer
    console.log('Transfer completed successfully');
  });
}

document.getElementById('SavAcctransferButton').addEventListener('click', SavAcctransferFunds);



























// Define the reference to the savings card's transactions
const SavCCtransactionsRef = ref(db, `${userId}/banking/cards/SavingsCC/transactions`);

// Function to update the transactions in the HTML
function updateSavingsCCTransactions(snapshot) {
    const transactionsDiv = document.getElementById('SavingsCardtransactions');
    transactionsDiv.innerHTML = ''; // Clear existing transactions
    
    snapshot.forEach((transactionSnapshot) => {
        const date = transactionSnapshot.key; // 'yyyy-mm-dd' which is the date of the transaction
        const transactionDetails = transactionSnapshot.val(); // transaction details

        // Construct the transaction entry with the details
        transactionsDiv.innerHTML += `
            <div class="transactionsRows transaction-entry">
                <p>
                    <span class="transaction-store transName">${transactionDetails.name}</span> <br> 
                    <span class="transaction-date transDate">${date}</span>
                </p>
                <p>
                    <span class="transaction-amount transAmount">$${transactionDetails.amount}</span>
                </p>
            </div>
        `;
    });
}

// Listen for changes to the transactions data
onValue(SavCCtransactionsRef, (snapshot) => {
  updateSavingsCCTransactions(snapshot);
});

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
      document.getElementById('sccurrentBalance').textContent = Math.abs(currentBalance).toFixed(0);
  }).catch((error) => {
      console.error("Error fetching transactions:", error);
      document.getElementById('sccurrentBalance').textContent = "!!";
  });
}
document.addEventListener('DOMContentLoaded', calculateBalanceOfsavingsCC);










// Get a reference to the database service **** For savings card-----------------------------
const BlackCardtransactionsRef = ref(db, 'banking/cards/blackCard/transactions');
// Create a function to update the transactions in the HTML
function updateBlackCardTransactions(transactions) {
    const BlackCardtransactionsDiv = document.getElementById('BlackCardtransactions');
    BlackCardtransactionsDiv.innerHTML = ''; // Clear existing transactions
    
    // Add each transaction to the page
    Object.keys(transactions).forEach((key) => {
      const BlackCardtransaction = transactions[key];
      BlackCardtransactionsDiv.innerHTML += `

        <div class="transactionsRows transaction-entry">
            <p>
                <span class="transaction-store transName">${key}</span> <br> <span class="transaction-date transDate">${BlackCardtransaction.date}</span>
            </p>
            <p>
                <span class="transaction-amount transAmount">$${BlackCardtransaction.amount}</span>
            </p>
        </div>`;
    });
  }

// Listen for changes to the transactions data
onValue(BlackCardtransactionsRef, (snapshot) => {
  const data = snapshot.val();
  updateBlackCardTransactions(data);
});





//For all the buttons on the banking page
document.addEventListener('DOMContentLoaded', () => {
    // Reference to the buttons and display divs
    const buttons = document.querySelectorAll('.button');
    const transactionsContainer = document.querySelector('.bankingScrollable');
    
    // Function to update button displays
    buttons.forEach(button => {
      button.addEventListener('click', function() {
        const displayDivs = document.querySelectorAll('.display');
        displayDivs.forEach(div => div.classList.remove('visible'));
        
        let targetId = '';
        switch(this.className.split(' ')[1]) {
          case 'checkingAccBtn': targetId = 'checkingsDiv'; break;
          case 'savingsAccBtn': targetId = 'savingsDiv'; break;
          case 'savingsCardBtn': targetId = 'savingsCardDiv'; break;
          case 'blackCardBtn': targetId = 'blackCaedDiv'; break;
          case 'transferBtn': targetId = 'transferDiv'; break;
          case 'ficoBtn': targetId = 'ficoDiv'; break;
        }
        
        const targetDiv = document.getElementById(targetId);
        if (targetDiv) {
          targetDiv.classList.add('visible');
        }
      });
    });
    
   
  });



  const checkingAccountRef = ref(db, 'banking/accounts/checkingsAccount');
  const savingsAccountRef = ref(db, 'banking/accounts/savingsAccount');
  const savingsCardRef = ref(db, 'banking/cards/savingsCard');
  const blackCardRef = ref(db, 'banking/cards/blackCard');

// Listen for changes to the checkingAccount data
onValue(checkingAccountRef, (snapshot) => {
  const accountData = snapshot.val();
  
  // Set the text content of the span elements to the corresponding values
  document.getElementById('account-number').textContent = accountData.accountNumber;
  document.getElementById('routing-number').textContent = accountData.routingNumber;
  // document.getElementById('balance').textContent = accountData.currentBalance;
  document.getElementById('interestRate').textContent = accountData.interestRate;
});

// Listen for changes to the savingsAccount data
onValue(savingsAccountRef, (snapshot) => {
    const accountData = snapshot.val();
    
    // Set the text content of the span elements to the corresponding values
    document.getElementById('saccount-number').textContent = accountData.accountNumber;
    document.getElementById('srouting-number').textContent = accountData.routingNumber;
    // document.getElementById('sbalance').textContent = accountData.currentBalance;
    document.getElementById('sinterestRate').textContent = accountData.interestRate;
  });


// Listen for changes to the savings card data
onValue(savingsCardRef, (snapshot) => {
    const accountData = snapshot.val();
    
    // Set the text content of the span elements to the corresponding values
    document.getElementById('scaccount-number').textContent = accountData.accountNumber;
    document.getElementById('sccard-number').textContent = accountData.cardNumber;
    document.getElementById('scapr').textContent = accountData.apr;
    // document.getElementById('sccurrentBalance').textContent = accountData.currentBalance;
    document.getElementById('sccreditLine').textContent = accountData.creditLine;
  });


// Listen for changes to the black card data
onValue(blackCardRef, (snapshot) => {
    const accountData = snapshot.val();
    
    // Set the text content of the span elements to the corresponding values
    document.getElementById('bcaccount-number').textContent = accountData.accountNumber;
    document.getElementById('bccard-number').textContent = accountData.cardNumber;
    document.getElementById('bcapr').textContent = accountData.apr;
    document.getElementById('bccurrentBalance').textContent = accountData.currentBalance;
    document.getElementById('bccreditLine').textContent = accountData.creditLine;
  });
























