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

// Initialize Firebase
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
const userId = "0901338";

const TestBudget = () => {

    useEffect(() => {
        fetchHistoricalSpending();
        const calculateButton = document.getElementById('calculateButton');
        const handleClick = () => {
            const income = parseFloat(document.getElementById('income').value);
            const rent = parseFloat(document.getElementById('rent').value);
            const food = parseFloat(document.getElementById('food').value);
            const utilities = parseFloat(document.getElementById('utilities').value);
            const transportation = parseFloat(document.getElementById('transportation').value);
            const otherExpenses = parseFloat(document.getElementById('otherExpenses').value);

            if (isNaN(income) || income <= 0) {
                alert('Please enter a valid positive number for income.');
                return;
            }

            const expenses = rent + food + utilities + transportation + otherExpenses;
            const savings = income - expenses;
            const spendingPercentage = ((expenses / income) * 100).toFixed(2);
            const savingsAdvice = calculateSavingsAdvice(savings);

            let resultsHTML = `
                <h2>Budget Summary</h2>
                <p>Total Monthly Income: $${income.toFixed(2)}</p>
                <p>Total Monthly Expenses: $${expenses.toFixed(2)}</p>
                <p>Total Savings: $${savings.toFixed(2)}</p>
                <p>Percentage of Income Spent: ${spendingPercentage}%</p>
                <p style="font-weight: 600";>Savings Advice: Save at least $${savingsAdvice.save.toFixed(2)}, you can spend $${savingsAdvice.spend.toFixed(2)} on other things.</p>
            `;

            if (savings < 0) {
                resultsHTML += `<p style="color: red;"><strong>Warning:</strong> You are spending more than your income!</p>`;
            }

            document.getElementById('results').innerHTML = resultsHTML;
            renderChart([rent, food, utilities, transportation, otherExpenses], ['Rent/Mortgage', 'Food', 'Utilities', 'Transportation', 'Other']);
        };

        calculateButton.addEventListener('click', handleClick);

        return () => {
            calculateButton.removeEventListener('click', handleClick);
        };
        
        
    }, []);

    function calculateSavingsAdvice(savings) {
        return {
            save: savings * 0.7,
            spend: savings * 0.3
        };
    }

    function renderChart(data, labels) {
        const ctx = document.getElementById('expenseChart').getContext('2d');
        // Check if the chart instance exists and is an instance of a Chart
        if (window.expenseChart instanceof Chart) {
            window.expenseChart.destroy(); // Destroy only if it exists and is a Chart
        }
        window.expenseChart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Expenses',
                    data: data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Function to fetch historical spending data
    function fetchHistoricalSpending() {
        const historicalSpendingRef = ref(db, `${userId}/budget`);
        get(historicalSpendingRef).then((snapshot) => {
            const historicalData = snapshot.val(); // m1, m2, m3, m4, m5
            const spendingValues = Object.values(historicalData); // Convert object to array
            getTotalSpentThisMonth(spendingValues);
        });
    }

    // Function to calculate and add this month's spending to the chart
    function getTotalSpentThisMonth(previousMonths) {
        // References to different transaction sources
        const refs = [
            ref(db, `${userId}/banking/accounts/SavingsAcc/transactions`),
            ref(db, `${userId}/banking/accounts/CheckingsAcc/transactions`),
            ref(db, `${userId}/banking/cards/SavingsCC/transactions`),
            ref(db, `${userId}/banking/cards/BlackCC/transactions`),
            ref(db, `${userId}/SendReceive/SendFunds`)
        ];

        let totalSpent = 0;
        let promises = refs.map(ref => get(ref));

        Promise.all(promises).then(snapshots => {
            snapshots.forEach(snapshot => {
                snapshot.forEach(childSnapshot => {
                    const transaction = childSnapshot.val();
                    if (transaction.type === 'spent' && isInCurrentMonth(childSnapshot.key)) {
                        totalSpent += parseFloat(transaction.amount);
                    }
                });
            });

            // Update total spent in HTML and render chart
            // document.getElementById('totalSpentThisMonth').textContent = totalSpent.toFixed(2);
            renderSpendingChart([...previousMonths, totalSpent]);
        });
    }

    function renderSpendingChart(spendingData) {
    const ctx = document.getElementById('spendingChart').getContext('2d');

    // Check if window.spendingChart exists and is an instance of Chart before trying to destroy it
    if (window.spendingChart instanceof Chart) {
        window.spendingChart.destroy();
    }

    // Create the spending chart
    window.spendingChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], // Update labels as per your data
            datasets: [{
                label: 'Monthly Spending',
                data: spendingData,
                backgroundColor: 'rgba(54, 162, 235, 0.2)', // Light blue background
                borderColor: 'rgba(54, 162, 235, 1)', // Solid blue line
                borderWidth: 2,
                fill: true, // Fill area under the line
                tension: 0.3 // Smooths the line
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            elements: {
                line: {
                    tension: 0.4 // This adds some curvature to the line
                },
                point: {
                    radius: 5, // Increases the size of the point markers
                    hoverRadius: 8 // Increases the hover state size
                }
            }
        }
    });
}

    function isInCurrentMonth(dateString) {
        const transactionDate = new Date(dateString);
        const currentDate = new Date();
        return transactionDate.getMonth() === currentDate.getMonth() &&
               transactionDate.getFullYear() === currentDate.getFullYear();
    }

    return (
        <div>
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
            
            <div className="header">
                <img className="headerLogo" src="images/logoWithTxt.jpeg" alt="" />
                <p className="pageName">Budgeting</p>
            </div>
            
            <div className="input-section">
                <div className="budGroup">
                    <label htmlFor="income">Monthly Income</label>
                    <input type="number" id="income" placeholder="Enter your monthly income" />
                </div>
                <div className="budGroup">
                    <label htmlFor="rent">Rent/Mortgage</label>
                    <input type="number" id="rent" placeholder="Enter your monthly rent/mortgage" />
                </div>
                <div className="budGroup">
                    <label htmlFor="food">Food</label>
                    <input type="number" id="food" placeholder="Monthly food expenses" />
                </div>
                <div className="budGroup">
                    <label htmlFor="utilities">Utilities</label>
                    <input type="number" id="utilities" placeholder="Monthly utilities" />
                </div>
                <div className="budGroup">
                    <label htmlFor="transportation">Transportation</label>
                    <input type="number" id="transportation" placeholder="Monthly transportation costs" />
                </div>
                <div className="budGroup">
                    <label htmlFor="otherExpenses">Other Expenses</label>
                    <input type="number" id="otherExpenses" placeholder="Other monthly expenses" />
                </div>
            </div>
            
            <button id="calculateButton">CALCULATE</button>
            
            <div className="budBottom">
                <div id="chartContainer" style={{ width: '50%', height: '300px' }}>
                    <canvas id="expenseChart"></canvas>
                </div>
                
                <div id="results" style={{ marginTop: '20px' }}></div>
            
                <div id="chartContainer">
                    <canvas id="spendingChart"></canvas>
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
            
            <div className="ftr">
                <div className="ftrLogoCont">
                    <img className="" src="images/logo.jpeg" alt="" />
                </div>
                <div className="ftrLinksCont">
                    <p>
                        <span style={{ fontFamily: 'inter', fontSize: '20px', fontWeight: 700 }}>Resources</span><br />
                        <br /><br />How It Works<br />
                        Our Fees<br />
                        Developers<br />
                        Trust and Safety
                    </p>
                    <p>
                        <span style={{ fontFamily: 'inter', fontSize: '20px', fontWeight: 700 }}>Useful Links</span><br />
                        <br /><br />Tips & tricks<br />
                        Manage Balance<br />
                        Ways to get paid<br />
                        Direct deposit
                    </p>
                    <p>
                        <span style={{ fontFamily: 'inter', fontSize: '20px', fontWeight: 700 }}>Company</span><br />
                        <br /><br /> About Us<br />
                        Careers<br />
                        Terms<br />
                        Privacy
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TestBudget;
