import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, get, query, limitToLast, onValue, set } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import './Style.css'; // Import your CSS file
import Chart from 'chart.js/auto';

import dashPic from './images/dashboardIcon.png';
import profPic from './images/profileIcon.png';
import bankPic from './images/bankingIcon.png';
import budgetPic from './images/budgetIcon.png';
import stockPic from './images/stockIcon.png';
import settingPic from './images/settingsIcon.png';

import restAD from './images/RestaurantAd.PNG';
import walmartAD from './images/WalmartAd.PNG';
import groceryAD from './images/groceryAd.PNG';
import appleAD from './images/AppletvAd.PNG';
import shellAD from './images/ShellAd.PNG';


const TestBanking = () => {

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

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const userId = "0901338"; // Use the provided user ID

    const transactionsRef = ref(db, `${userId}/banking/accounts/CheckingsAcc/transactions`);
    const SavCCtransactionsRef = ref(db, `${userId}/banking/cards/SavingsCC/transactions`);
    const SavAcctransactionsRef = ref(db, `${userId}/banking/accounts/SavingsAcc/transactions`);
    const BlackCardtransactionsRef = ref(db, 'banking/cards/blackCard/transactions');

    const checkingAccountRef = ref(db, 'banking/accounts/checkingsAccount');
    const savingsAccountRef = ref(db, 'banking/accounts/savingsAccount');
    const savingsCardRef = ref(db, 'banking/cards/savingsCard');
    const blackCardRef = ref(db, 'banking/cards/blackCard');

    const [targetDiv, setTargetDiv] = useState('');
    const [checkingAccount, setCheckingAccount] = useState({});
    const [savingsAccount, setSavingsAccount] = useState({});
    const [savingsCard, setSavingsCard] = useState({});
    const [blackCard, setBlackCard] = useState({});
    const [chartData, setChartData] = useState({});
    const [blackCardTransactions, setBlackCardTransactions] = useState({});

    useEffect(() => {
        // Listen for changes to the transactions data
        onValue(transactionsRef, (snapshot) => {
            updateTransactions(snapshot);
        });

        document.addEventListener('DOMContentLoaded', calculateBalanceOfCheckingsAcc);
        
        getBalanceOfCheckingsAcc((balance) => {
            document.getElementById('ChkAccbalance').textContent = balance.toFixed(2);
        });

        const transferButton = document.getElementById('chkAcctransferButton');
        if (transferButton) {
            transferButton.addEventListener('click', transferFunds);
        }

        // Listen for changes to the transactions data
        onValue(SavAcctransactionsRef, (snapshot) => {
            updateSavingsAccTransactions(snapshot);
        });

        document.addEventListener('DOMContentLoaded', calculateBalanceOfsavingsAcc);

        getBalanceOfSavingsAcc((balance) => {
            document.getElementById('SvnAccbalance').textContent = balance.toFixed(2);
        });        

        document.getElementById('SavAcctransferButton').addEventListener('click', SavAcctransferFunds);

        // Listen for changes to the transactions data
        onValue(SavCCtransactionsRef, (snapshot) => {
            updateSavingsCCTransactions(snapshot);
        });
  
        document.addEventListener('DOMContentLoaded', calculateBalanceOfsavingsCC);

        document.querySelectorAll('.button').forEach(button => {
            button.addEventListener('click', handleButtonClick);
        });

        const updateAccountData = (snapshot, setter) => {
            const accountData = snapshot.val();
            setter(accountData);
        };

        
        

        onValue(BlackCardtransactionsRef, (snapshot) => {
            const data = snapshot.val();
            updateBlackCardTransactions(data);
        });

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

            setChartData({
                labels: labels,
                datasets: [{
                    label: `FICO Scores (past 6 months)`,
                    data: scoresData,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(255, 99, 32, 1)',
                    borderWidth: 3
                }]
            });

            // Create chart once data is fetched
            const ctx = document.getElementById('ficoChart');
            new Chart(ctx, {
                type: 'line',
                data: chartData,
                options: {
                    scales: {
                        y: {
                            beginAtZero: false
                        }
                    }
                }
            });
        }).catch((error) => {
            console.error("Error fetching FICO scores:", error);
        });

        const checkingAccountListener = onValue(checkingAccountRef, (snapshot) => updateAccountData(snapshot, setCheckingAccount));
        const savingsAccountListener = onValue(savingsAccountRef, (snapshot) => updateAccountData(snapshot, setSavingsAccount));
        const savingsCardListener = onValue(savingsCardRef, (snapshot) => updateAccountData(snapshot, setSavingsCard));
        const blackCardListener = onValue(blackCardRef, (snapshot) => updateAccountData(snapshot, setBlackCard));


        return () => {
            checkingAccountListener(); // Unsubscribe from checking account updates
            savingsAccountListener(); // Unsubscribe from savings account updates
            savingsCardListener(); // Unsubscribe from savings card updates
            blackCardListener(); // Unsubscribe from black card updates
            updateFicoScore();
            document.querySelectorAll('.button').forEach(button => {
                button.removeEventListener('click', handleButtonClick);
            });
        };

    }, []);

    const updateBlackCardTransactions = (transactions) => {
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
    };


    // Function to update the transactions in the HTML
    function updateTransactions(snapshot) {
        const transactionsDiv = document.getElementById('transactions');
        
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

          // Function to update the transactions in the HTML
            function updateSavingsCCTransactions(snapshot) {
                const transactionsDiv = document.getElementById('SavingsCardtransactions');
                
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
            

            const handleButtonClick = (event) => {
                const targetId = getTargetId(event.target.className);
                const displayDivs = document.querySelectorAll('.display');
                displayDivs.forEach(div => div.classList.remove('visible'));
                
                const targetDiv = document.getElementById(targetId);
                if (targetDiv) {
                    targetDiv.classList.add('visible');
                    setTargetDiv(targetId);
                }
            };
        
            const getTargetId = (className) => {
                switch (className.split(' ')[1]) {
                    case 'checkingAccBtn': return 'checkingsDiv';
                    case 'savingsAccBtn': return 'savingsDiv';
                    case 'savingsCardBtn': return 'savingsCardDiv';
                    case 'blackCardBtn': return 'blackCaedDiv';
                    case 'transferBtn': return 'transferDiv';
                    case 'ficoBtn': return 'ficoDiv';
                    default: return '';
                }
            };

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

    return (
        <div>
            <div className="navigationBar">
                <div className="profileIcon navIconANDtxt">
                    <img className="navIcons" src={profPic} alt=""></img>
                    <p>Profile</p>
                </div>
                <div className="middleIcons">
                    <div className="navIconANDtxt">
                        <img className="navIcons" src={dashPic} alt=""></img>
                        <a className="navLinks" href="index.html">
                            <Link className="navLinks" to="/dashboard">
                                <p>Dashboard</p>
                            </Link>
                        </a>
                    </div>
                    <div className="navIconANDtxt" >
                        <img className="navIcons" src={bankPic} alt=""></img>
                        <a className="navLinks" href="banking.html">
                        <Link className="navLinks" to="/banking">
                            <p>Banking</p>
                        </Link>
                        </a>
                    </div>
                    <div className="navIconANDtxt" >
                        <img className="navIcons" src={budgetPic} alt=""></img>
                        <Link className='navLinks' to="/budgeting">
                            <p>Budgeting</p>
                        </Link>
                    </div>
                    <div className="navIconANDtxt" >
                        <img className="navIcons" src={stockPic} alt=""></img>
                        <Link className='navLinks' to="/stocks">
                            <p>Stocks</p>
                        </Link>
                    </div>
                </div>
                <div className="settingsIcon navIconANDtxt">
                    <img className="navIcons" src={settingPic} alt=""></img>
                    <Link className='navLinks' to="/backdoor">
                      <p>Settings</p>
                      </Link>
                </div>
            </div>
            <div className="bodySection">
                <div className="selectionBar">
                    <div className='bankingOptions accCont'>
                        <h5 style={{ margin: 0, fontWeight: 800 }}>ACCOUNTS</h5>
                        <div className='dropdownInvisCont'>
                            <div className='accountsDropdown'>
                                <p className="button checkingAccBtn" >Checkings (...5547)</p>
                                <p className="button savingsAccBtn" >Savings (...3975)</p>
                            </div>
                        </div>
                    </div>
                    <div className="bankingOptions">
                        <h5 style={{ margin: 0, fontWeight: 800 }}>CARDS</h5>
                            <div className="dropdownInvisCont">
                                <div className="cardsDropdown">
                                    <div className="button savingsCardBtn card1">
                                        <span className="cardName">SAVINGS PLUS</span>
                                        <span className="cardNum">XXXX-3845</span>
                                    </div>
                                    <div class="button blackCardBtn card2">
                                        <span className="cardName">BLACK PLATINUM</span>
                                    <span className="cardNum">XXXX-9348</span>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div className="button transferBtn bankingOptions" style={{ fontSize: "14px", fontWeight: 700 }}>TRANSFER</div>
                    <button className="button ficoBtn  bankingOptions" type="submit">FICO SCORE</button>
                </div>
                <div className='repeatDisplays display checkingsDiv' id='checkingsDiv'>
                    <div className='repeatDisplays22'>
                        <div className='mainDisplay'>
                            <div className='transactionTxt'>
                                <span style={{ marginTop: '22px', marginLeft: '32px' }}>Transactions</span>
                            </div>
                            <div className='bankingScrollable'>
                                <div id="transactions" className='transactionsRowsx'></div>
                            </div>
                        </div>
                        <div className='rightInfoBarss'>
                            <div className='infoTopCont'>
                                <p className='checkAccTxt'>
                                    Checkings Account
                                </p>
                                <p className='accInfo'>
                                    Account Number: <span className="boldBalances" id="account-number"></span><br />
                                    Routing Number: <span className="boldBalances" id="routing-number"></span><br />
                                    Interest Rate : <span className="boldBalances" id="interestRate"></span>%
                                </p>
                            </div>
                            <div className='infoBottomCont'>
                                <p className='acntBalTxt'>
                                    Account Balance
                                </p>
                                <p className='balanceAmount'>
                                    $ <span id="ChkAccbalance">--</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='transferFunds'>
                        <h2>Transfer Funds</h2>
                        <div className='transferInputs'>
                            <select id='transferTo'>
                                <option value={"SavingsAcc"}>Savings Account</option>
                            </select>

                            <input type='number' id='ChkAccamount' placeholder='Amount'></input>

                            <button id='chckAcctransferButton'>Transfer</button>
                        </div>
                    </div>
                    <div className="saveOnGasCont">
                        <img src={restAD} alt=""></img>
                        <img src={appleAD} alt=""></img>
                        <img src={shellAD} alt=""></img>
                        <img src={walmartAD} alt=""></img>
                        <img src={groceryAD} alt=""></img>
                    </div>
                    <div className='bankFooter'>
                        <p>
                            Disclosures - THIS Bank, N.A., and its affiliates offer investment products, which may include bank-managed accounts and custody, as part of its trust and fiduciary services. Other investment products and services, such as brokerage and advisory accounts, are offered through THIS Bank LLC, a member of FINRA and SIPC. Insurance products are made available through Chase Insurance Agency, Inc. (CIA), a licensed insurance agency, doing business as Chase Insurance Agency Services, Inc. in Florida. THIS Bank and CIA are affiliated companies under the common control of THIS Bank & Co. Products not available in all states.
                            Please note that the privacy policy and security practices of the linked website may differ from those of THIS Bank, N.A., and its affiliates. It is recommended that customers review the privacy statements and security policies of any third-party websites accessed through this site. THIS Bank, N.A., does not guarantee or endorse the information, recommendations, products, or services offered on third-party sites.
                            Investments in securities: Not FDIC Insured • No Bank Guarantee • May Lose Value. Investing in securities involves risks, and there is always the potential of losing money when you invest in securities. Before investing, consider your investment objectives and THIS Bank's charges and expenses. The investment products sold through THIS Bank and its affiliates are not insured by the FDIC, are not deposits or other obligations of, or guaranteed by, THIS Bank, and are subject to investment risks, including possible loss of the principal amount invested.
                            All loan applications are subject to credit review and approval. Interest rates and terms may vary, and the approval of your loan is based on specific criteria, including your credit history, income, and other factors.
                            THIS Bank is committed to adhering to a strict code of ethics and upholding the highest standards of trust and integrity. Potential conflicts of interest are identified and managed in accordance with our conflict of interest policies and procedures to ensure our clients' interests are protected at all times.
                            For additional information, including details about our products, services, and fees, please contact a THIS Bank representative. By using THIS Bank's services, you agree to our Terms of Use and acknowledge you have read our Privacy Policy.
                        </p>
                    </div>
                </div>
                <div className='repeatDisplays display savingsDiv' id='savingsDiv'>
                    <div className='repeatDisplays22'>
                        <div className='mainDisplay'>
                            <div className='transactionTxt'>
                                <span style={{ marginTop: '22px', marginLeft: '32px' }}>Transactions</span>
                            </div>
                            <div className='bankingScrollable'>
                                <div id="Savingstransactions" className='transactionsRowsx'></div>
                            </div>
                        </div>
                        <div className='rightInfoBarss'>
                            <div className='infoTopCont'>
                                <p className='checkAccTxt'>
                                    Savings Account
                                </p>
                                <p className='accInfo'>
                                    Account Number: <span className="boldBalances" id="account-number"></span><br />
                                    Routing Number: <span className="boldBalances" id="routing-number"></span><br />
                                    Interest Rate : <span className="boldBalances" id="interestRate"></span>%
                                </p>
                            </div>
                            <div className='infoBottomCont'>
                                <p className='acntBalTxt'>
                                    Account Balance
                                </p>
                                <p className='balanceAmount'>
                                    $ <span id="SvnAccbalance">--</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='transferFunds'>
                        <h2>Transfer Funds</h2>
                        <div className='transferInputs'>
                            <select id='transferTo'>
                                <option value={"SavingsAcc"}>Checkings Account</option>
                            </select>

                            <input type='number' id='SavAccamount' placeholder='Amount'></input>

                            <button id='SavAcctransferButton'>Transfer</button>
                        </div>
                    </div>
                    <div className="saveOnGasCont">
                        <img src={restAD} alt=""></img>
                        <img src={appleAD} alt=""></img>
                        <img src={shellAD} alt=""></img>
                        <img src={walmartAD} alt=""></img>
                        <img src={groceryAD} alt=""></img>
                    </div>
                    <div className='bankFooter'>
                        <p>
                            Disclosures - THIS Bank, N.A., and its affiliates offer investment products, which may include bank-managed accounts and custody, as part of its trust and fiduciary services. Other investment products and services, such as brokerage and advisory accounts, are offered through THIS Bank LLC, a member of FINRA and SIPC. Insurance products are made available through Chase Insurance Agency, Inc. (CIA), a licensed insurance agency, doing business as Chase Insurance Agency Services, Inc. in Florida. THIS Bank and CIA are affiliated companies under the common control of THIS Bank & Co. Products not available in all states.
                            Please note that the privacy policy and security practices of the linked website may differ from those of THIS Bank, N.A., and its affiliates. It is recommended that customers review the privacy statements and security policies of any third-party websites accessed through this site. THIS Bank, N.A., does not guarantee or endorse the information, recommendations, products, or services offered on third-party sites.
                            Investments in securities: Not FDIC Insured • No Bank Guarantee • May Lose Value. Investing in securities involves risks, and there is always the potential of losing money when you invest in securities. Before investing, consider your investment objectives and THIS Bank's charges and expenses. The investment products sold through THIS Bank and its affiliates are not insured by the FDIC, are not deposits or other obligations of, or guaranteed by, THIS Bank, and are subject to investment risks, including possible loss of the principal amount invested.
                            All loan applications are subject to credit review and approval. Interest rates and terms may vary, and the approval of your loan is based on specific criteria, including your credit history, income, and other factors.
                            THIS Bank is committed to adhering to a strict code of ethics and upholding the highest standards of trust and integrity. Potential conflicts of interest are identified and managed in accordance with our conflict of interest policies and procedures to ensure our clients' interests are protected at all times.
                            For additional information, including details about our products, services, and fees, please contact a THIS Bank representative. By using THIS Bank's services, you agree to our Terms of Use and acknowledge you have read our Privacy Policy.
                        </p>
                    </div>
                </div>
                <div className='repeatDisplays display savingsCardDiv' id='savingsCardDiv'>
                    <div className='repeatDisplays22'>
                        <div className='mainDisplay'>
                            <div className='transactionTxt'>
                                <span style={{ marginTop: '22px', marginLeft: '32px' }}>Transactions</span>
                            </div>
                            <div className='bankingScrollable'>
                                <div id="SavingsCardtransactions" className='transactionsRowsx'></div>
                            </div>
                        </div>
                        <div className='rightInfoBarss'>
                            <div className='infoTopCont'>
                                <p className='checkAccTxt'>
                                    Savings Plus Card
                                </p>
                                <p className='accInfo'>
                                    Account Number : <span  className="boldBalances"  id="scaccount-number"></span><br />
                                    Card Number    : <span className="boldBalances"  id="sccard-number"></span><br />
                                    APR: <span className="boldBalances" style={{ fontWeight: 500 }} id="scapr"></span>%<br  />
                                    Current Balance: $<span  className="boldBalances"  id="sccurrentBalance"></span><br  />
                                    Credit Line    : $<span className="boldBalances"   id="sccreditLine"></span>
                                </p>
                            </div>
                            <div className='infoBottomCont'>
                                <div className='savingsCardBtn card1 cardInside'>
                                    <span className="cardName">SAVINGS PLUS</span>
                                    <span className="cardNum">XXXX-3845</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="saveOnGasCont">
                        <img src={restAD} alt=""></img>
                        <img src={appleAD} alt=""></img>
                        <img src={shellAD} alt=""></img>
                        <img src={walmartAD} alt=""></img>
                        <img src={groceryAD} alt=""></img>
                    </div>
                    <div className='bankFooter'>
                        <p>
                            Disclosures - THIS Bank, N.A., and its affiliates offer investment products, which may include bank-managed accounts and custody, as part of its trust and fiduciary services. Other investment products and services, such as brokerage and advisory accounts, are offered through THIS Bank LLC, a member of FINRA and SIPC. Insurance products are made available through Chase Insurance Agency, Inc. (CIA), a licensed insurance agency, doing business as Chase Insurance Agency Services, Inc. in Florida. THIS Bank and CIA are affiliated companies under the common control of THIS Bank & Co. Products not available in all states.
                            Please note that the privacy policy and security practices of the linked website may differ from those of THIS Bank, N.A., and its affiliates. It is recommended that customers review the privacy statements and security policies of any third-party websites accessed through this site. THIS Bank, N.A., does not guarantee or endorse the information, recommendations, products, or services offered on third-party sites.
                            Investments in securities: Not FDIC Insured • No Bank Guarantee • May Lose Value. Investing in securities involves risks, and there is always the potential of losing money when you invest in securities. Before investing, consider your investment objectives and THIS Bank's charges and expenses. The investment products sold through THIS Bank and its affiliates are not insured by the FDIC, are not deposits or other obligations of, or guaranteed by, THIS Bank, and are subject to investment risks, including possible loss of the principal amount invested.
                            All loan applications are subject to credit review and approval. Interest rates and terms may vary, and the approval of your loan is based on specific criteria, including your credit history, income, and other factors.
                            THIS Bank is committed to adhering to a strict code of ethics and upholding the highest standards of trust and integrity. Potential conflicts of interest are identified and managed in accordance with our conflict of interest policies and procedures to ensure our clients' interests are protected at all times.
                            For additional information, including details about our products, services, and fees, please contact a THIS Bank representative. By using THIS Bank's services, you agree to our Terms of Use and acknowledge you have read our Privacy Policy.
                        </p>
                    </div>
                </div>
                <div className='repeatDisplays display blackCaedDiv' id='blackCaedDiv'>
                    <div className='repeatDisplays22'>
                        <div className='mainDisplay'>
                            <div className='transactionTxt'>
                                <span style={{ marginTop: '22px', marginLeft: '32px' }}>Transactions</span>
                            </div>
                            <div className='bankingScrollable'>
                                <div id="BlackCardtransactions" className='transactionsRowsx'></div>
                            </div>
                        </div>
                        <div className='rightInfoBarss'>
                            <div className='infoTopCont'>
                                <p className='checkAccTxt'>
                                    Black Platinum Card
                                </p>
                                <p className="accInfo">
                                    Account Number : <span  className="boldBalances"  id="bcaccount-number"></span><br  />
                                    Card Number    : <span className="boldBalances"  id="bccard-number"></span><br  />
                                    APR            : <span   className="boldBalances"  id="bcapr"></span>%<br  />
                                    Current Balance: $<span  className="boldBalances"  id="bccurrentBalance"></span><br  />
                                    Credit Line    : $<span className="boldBalances"   id="bccreditLine"></span>
                                </p>
                            </div>
                            <div className='infoBottomCont'>
                                <div className="blackCardBtn card2 cardInside">
                                    <span className="cardName">BLACK PLATINUM</span>
                                    <span className="cardNum">XXXX-9348</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="saveOnGasCont">
                        <img src={restAD} alt=""></img>
                        <img src={appleAD} alt=""></img>
                        <img src={shellAD} alt=""></img>
                        <img src={walmartAD} alt=""></img>
                        <img src={groceryAD} alt=""></img>
                    </div>
                    <div className='bankFooter'>
                        <p>
                            Disclosures - THIS Bank, N.A., and its affiliates offer investment products, which may include bank-managed accounts and custody, as part of its trust and fiduciary services. Other investment products and services, such as brokerage and advisory accounts, are offered through THIS Bank LLC, a member of FINRA and SIPC. Insurance products are made available through Chase Insurance Agency, Inc. (CIA), a licensed insurance agency, doing business as Chase Insurance Agency Services, Inc. in Florida. THIS Bank and CIA are affiliated companies under the common control of THIS Bank & Co. Products not available in all states.
                            Please note that the privacy policy and security practices of the linked website may differ from those of THIS Bank, N.A., and its affiliates. It is recommended that customers review the privacy statements and security policies of any third-party websites accessed through this site. THIS Bank, N.A., does not guarantee or endorse the information, recommendations, products, or services offered on third-party sites.
                            Investments in securities: Not FDIC Insured • No Bank Guarantee • May Lose Value. Investing in securities involves risks, and there is always the potential of losing money when you invest in securities. Before investing, consider your investment objectives and THIS Bank's charges and expenses. The investment products sold through THIS Bank and its affiliates are not insured by the FDIC, are not deposits or other obligations of, or guaranteed by, THIS Bank, and are subject to investment risks, including possible loss of the principal amount invested.
                            All loan applications are subject to credit review and approval. Interest rates and terms may vary, and the approval of your loan is based on specific criteria, including your credit history, income, and other factors.
                            THIS Bank is committed to adhering to a strict code of ethics and upholding the highest standards of trust and integrity. Potential conflicts of interest are identified and managed in accordance with our conflict of interest policies and procedures to ensure our clients' interests are protected at all times.
                            For additional information, including details about our products, services, and fees, please contact a THIS Bank representative. By using THIS Bank's services, you agree to our Terms of Use and acknowledge you have read our Privacy Policy.
                        </p>
                    </div>
                </div>
                <div className='repeatDisplays display transferDiv' id='transferDiv'>
                    <div className='repeatDisplay22'>
                        <div className='mainDisplay'>
                            <div className='transactionTxt'>
                                <span style={{ marginTop: '22px', marginLeft: '32px' }}>Recent Transfers</span>
                            </div>
                            <div className='bankingScrollable'>
                                <div id='transferMoney' className='transactionsRowsx'>
                                    <div className='transactionRows transaction-entry'>
                                        <p>
                                            <span className="transaction-store transName">John Doe</span> <br  /> 
                                            <span className="transaction-date transDate">04-02-2024</span>
                                        </p>
                                        <p>
                                            <span className="transaction-amount transAmount">$22.22</span>
                                        </p>
                                    </div>

                                    <div className="transactionsRows transaction-entry">
                                        <p>
                                            <span className="transaction-store transName">Urbss Kazi</span> <br  /> 
                                            <span className="transaction-date transDate">03-23-2024</span>
                                        </p>
                                        <p>
                                            <span className="transaction-amount transAmount">$12.50</span>
                                        </p>
                                    </div>

                                    <div className="transactionsRows transaction-entry">
                                        <p>
                                            <span className="transaction-store transName">Fardin</span> <br   /> 
                                            <span className="transaction-date transDate">03-03-2024</span>
                                        </p>
                                        <p>
                                            <span className="transaction-amount transAmount">$50.00</span>
                                        </p>
                                    </div>

                                    <div className="transactionsRows transaction-entry">
                                        <p>
                                            <span className="transaction-store transName">Feona</span> <br  /> 
                                            <span className="transaction-date transDate">02-28-2024</span>
                                        </p>
                                        <p>
                                            <span className="transaction-amount transAmount">$25.00</span>
                                        </p>
                                    </div>

                                    <div className="transactionsRows transaction-entry">
                                        <p>
                                            <span className="transaction-store transName">Ishrak</span> <br  /> 
                                            <span className="transaction-date transDate">02-15-2024</span>
                                        </p>
                                        <p>
                                            <span className="transaction-amount transAmount">$30.00</span>
                                        </p>
                                    </div>

                                    <div className="transactionsRows transaction-entry">
                                        <p>
                                            <span className="transaction-store transName">Prerona</span> <br  /> 
                                            <span className="transaction-date transDate">02-01-2024</span>
                                        </p>
                                        <p>
                                            <span className="transaction-amount transAmount">$46.00</span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='rightInfoBarss'>
                            <div className='infoTopCont'>
                                <p className="checkAccTxt sentnameTxt">
                                    Shahriar Rivan
                                </p>
                                <p className="accInfo qrCont">
                                    <img src="images/qr.png" alt=""></img>
                                </p>
                            </div>
                            <div className='infoBottomCont'>
                                <p className="acntBalTxt">
                                    Enter Amount
                                </p>
                                <div className="sentInputField">
                                    <span style={{ color: 'rgba(128, 128, 128, 0.514)', fontSize: '55px' }}>$</span>
                                    <div className="sendMoneyBtn">
                                        SEND
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='repeatDisplays display ficoDiv' id='ficoDiv'>
                    <div className='ficoCont'>
                        <div className='ficoScoreCont'>
                            <p>FICO SCORE<br  /><span id="scoreDisplay">--</span></p>
                        </div>
                        <div className='progress-container'>
                            <div className='progress-bar' id='ficoScoreProgressBar'></div>
                        </div>
                        <div className='ficoChart'>
                            <div id='charts'>
                                <canvas id='chart1'></canvas>
                            </div>
                        </div>
                    </div>
                    <div className='ficoXtraCont'>
                        <div className='ficoXtra1 fx1'>
                            <p className='ficoXtraTxt'>
                                Total Accounts
                            </p>
                            <div className='ficoXtraInside'>
                                <p className='ficoXtraNum'>
                                    5
                                </p>
                            </div>
                        </div>

                        <div className='ficoXtra1 fx2'>
                            <p className='ficoXtraTxt'>
                                Length of Credit
                            </p>
                            <div className='ficoXtraInside'>
                                <p className="ficoXtraNum">
                                    10 <span style={{ fontSize: '25px' }}>years</span>
                                </p>
                            </div>
                        </div>

                        <div className="ficoXtra1 fx3">
                            <p className="ficoXtraTxt">
                                Revolving Utilizations
                            </p>
                            <div className="ficoXtraInside">
                                <p className="ficoXtraNum">
                                    20%
                                </p>
                            </div>
                        </div>

                        <div className="ficoXtra1 fx4">
                            <p className="ficoXtraTxt">
                                Credit Usage
                            </p>
                            <div className="ficoXtraInside">
                                <p className="ficoXtraNum">
                                    70%
                                </p>
                            </div>
                        </div>

                        <div className="ficoXtra1 fx5">
                            <p className="ficoXtraTxt">
                                Recent Inquiries
                            </p>
                            <div className="ficoXtraInside">
                                <p className="ficoXtraNum">
                                    3
                                </p>
                            </div>
                        </div>

                        <div className="ficoXtra1 fx6">
                            <p className="ficoXtraTxt">
                                Missed Payments
                            </p>
                            <div className="ficoXtraInside">
                                <p className="ficoXtraNum">
                                    1
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='ficoTips'>
                        <p>
                            <span style={{ fontSize: '20px', fontWeight: '900' }}>TIPS for a healthy score</span><br/><br/>
                                    Maintaining good credit is crucial for financial health and can impact your ability to obtain loans, secure favorable interest rates, and even influence employment opportunities. Here are some tips to help keep your credit score high:
                            <br/><br/>1. **Pay Bills on Time**: Timely payment of all bills, including credit cards, loans, and utility bills, is one of the most significant factors affecting your credit score. Set up reminders or automatic payments to avoid late payments.   
                            <br/>2. **Keep Credit Balances Low**: High balances relative to your credit limits can hurt your credit score. Aim to use less than 30% of your available credit across all cards and lines of credit.
                            <br/>3. **Maintain Old Credit Accounts**: The age of your credit history matters. Avoid closing old credit accounts, as they help maintain a longer credit history and can boost your score.
                            <br/> 4. **Limit New Credit Applications**: Each time you apply for credit, it can cause a small, temporary drop in your credit score. Apply for new credit accounts only when necessary.  
                            <br/> 5. **Monitor Your Credit Reports**: Regularly check your credit reports from the three major credit bureaus—Equifax, Experian, and TransUnion. Look for errors or fraudulent activities and dispute any inaccuracies.  
                            <br/>6. **Diversify Your Credit**: Having a mix of credit types, such as revolving credit (credit cards) and installment loans (auto, personal, mortgage), can positively impact your credit score.
                            <br/>Following these steps consistently can help you build and maintain a strong credit profile, enabling greater financial flexibility and security.
                        </p>
                    </div>
                </div>

                <div className="bankFooter">
                    <p>
                        Disclosures - THIS Bank, N.A., and its affiliates offer investment products, which may include bank-managed accounts and custody, as part of its trust and fiduciary services. Other investment products and services, such as brokerage and advisory accounts, are offered through THIS Bank LLC, a member of FINRA and SIPC. Insurance products are made available through Chase Insurance Agency, Inc. (CIA), a licensed insurance agency, doing business as Chase Insurance Agency Services, Inc. in Florida. THIS Bank and CIA are affiliated companies under the common control of THIS Bank & Co. Products not available in all states.
                        Please note that the privacy policy and security practices of the linked website may differ from those of THIS Bank, N.A., and its affiliates. It is recommended that customers review the privacy statements and security policies of any third-party websites accessed through this site. THIS Bank, N.A., does not guarantee or endorse the information, recommendations, products, or services offered on third-party sites.
                        Investments in securities: Not FDIC Insured • No Bank Guarantee • May Lose Value. Investing in securities involves risks, and there is always the potential of losing money when you invest in securities. Before investing, consider your investment objectives and THIS Bank's charges and expenses. The investment products sold through THIS Bank and its affiliates are not insured by the FDIC, are not deposits or other obligations of, or guaranteed by, THIS Bank, and are subject to investment risks, including possible loss of the principal amount invested.
                        All loan applications are subject to credit review and approval. Interest rates and terms may vary, and the approval of your loan is based on specific criteria, including your credit history, income, and other factors.
                        THIS Bank is committed to adhering to a strict code of ethics and upholding the highest standards of trust and integrity. Potential conflicts of interest are identified and managed in accordance with our conflict of interest policies and procedures to ensure our clients' interests are protected at all times.
                        For additional information, including details about our products, services, and fees, please contact a THIS Bank representative. By using THIS Bank's services, you agree to our Terms of Use and acknowledge you have read our Privacy Policy.
                    </p>
                </div>
            </div>
            <div className='ftr'>
                <div className='ftrLogoCont'>
                    <img className="" src="images/logo.jpeg" alt=""></img>
                </div>
                <div className='ftrLinksCont'>
                    <p>
                        <span style={{ fontFamily: "'inter'", fontSize: '20px', fontWeight: '700' }}>Resources</span><br/>
                        <br/><br/>How It Works<br/>
                        Our Fees<br/>
                        Developers<br/>
                        Trust and Safety
                    </p>
                    <p>
                        <span style={{ fontFamily: "'inter'", fontSize: '20px', fontWeight: '700' }}>Useful Links</span><br/>
                        <br/><br/>Tips & tricks<br/>
                        Manage Balance<br/>
                        Ways to get paid<br/>
                        Direct deposit
                    </p>
                    <p>
                    <span style={{ fontFamily: "'inter'", fontSize: '20px', fontWeight: '700' }}>Company</span><br/>
                        <br/><br/> About Us<br/>
                        Careers<br/>
                        Terms<br/>
                        Privacy
                    </p>
                </div>
            </div>
        </div>
    );
}

export default TestBanking;


