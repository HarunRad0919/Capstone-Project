// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, onValue, set } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";


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



// -------------------------------------------------------------------------

  //for backDoor==============================
  // Function to submit the transaction
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















document.getElementById('addDataButton').addEventListener('click', () => {
    const form = document.getElementById('randomDataForm');
    form.style.display = form.style.display === 'flex' ? 'none' : 'flex';
});

document.getElementById('submitRandomDataButton').addEventListener('click', () => {
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
});

function getRandomDate(month) {
    const date = new Date();
    date.setMonth(date.getMonth() - month, 1);
    const day = Math.floor(Math.random() * (28 - 1 + 1)) + 1;
    date.setDate(day);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getRandomName(transactionType, transactionAction) {
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

function getRandomAmount(isSpent) {
    if (isSpent) return Math.floor(Math.random() * 50) + 1; // Spent: 1-50
    return Math.floor(Math.random() * 150) + 50; // Deposit: 50-200, ensuring deposit is more
}

function determineBasePath(transactionType, date) {
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


