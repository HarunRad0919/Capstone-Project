import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Style.css'; // Import your CSS file here
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-app.js";
import { getDatabase, ref, set, onValue } from "https://www.gstatic.com/firebasejs/9.1.0/firebase-database.js";
import Chart from 'chart.js/auto';

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

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const userId = "0901338";
let stockChart = null;  // Declare stockChart globally to manage its lifecycle



const TestStocks = () => {

    useEffect(() => {
        document.getElementById('searchButton').addEventListener('click', () => {
            const symbol = document.getElementById('stockInput').value.toUpperCase();
            addStockToFirebase(symbol);
        });
    
        displayStocks();
    }, []);
    
    function addStockToFirebase(symbol) {
        const stockRef = ref(db, `${userId}/favStocks/${symbol}`);
        set(stockRef, { symbol: symbol });
    }
    
    function displayStocks() {
        const stocksRef = ref(db, `${userId}/favStocks`);
        onValue(stocksRef, (snapshot) => {
            const container = document.getElementById('stockButtons');
            container.innerHTML = '';
            snapshot.forEach((childSnapshot) => {
                const symbol = childSnapshot.val().symbol;
                const button = document.createElement('button');
                button.textContent = symbol;
                generateMockChart(symbol);
                fetchStockNews(symbol);
                document.getElementById('stockName').textContent = symbol; 
                button.addEventListener('click', () => {
                    document.getElementById('stockName').textContent = symbol; 
                    generateMockChart(symbol);
                    fetchStockNews(symbol);
                });
                container.appendChild(button);
            });
        });
    }
    
    function generateMockChart(symbol) {
        const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
        const data = labels.map(() => Math.floor(Math.random() * 100) + 100);
    
        const ctx = document.getElementById('stockChart').getContext('2d');
        if (stockChart) {
            stockChart.destroy();  // Destroy the existing chart before creating a new one
        }
        stockChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: `${symbol} Stock Price`,
                    data: data,
                    borderColor: '#c3ff00',
                    tension: 0.2
                }]
            },
            options: {
                scales: {
                    y: {
                        grid: {
                            display: true,
                            color: '#3d3d3d',
                            lineWidth: 4
                        },
                        ticks: {
                            color: '#3d3d3d'
                        }
                    },
                    x: {
                        grid: {
                            color: '#3d3d3d',
                            lineWidth: 0  
                        }
                    }
                }
            }
        });
    }
    
    const finnhubApiKey="conss9hr01qm6hd15tqgconss9hr01qm6hd15tr0";
    function fetchStockNews(symbol) {
        const url = `https://finnhub.io/api/v1/company-news?symbol=${symbol}&from=${getDateOneMonthAgo()}&to=${getDateToday()}&token=${finnhubApiKey}`;
        fetch(url)
        .then(response => response.json())
        .then(news => {
            const newsContainer = document.getElementById('stockNews');
            newsContainer.innerHTML = '';
            // Use slice to get only the first 10 news items
            news.slice(0, 10).forEach(item => {
                const newsElement = document.createElement('div');
                newsElement.innerHTML = `<p><strong>${item.headline}</strong><br>${item.summary}<br><a href="${item.url}" target="_blank">Read more</a></p>`;
                newsContainer.appendChild(newsElement);
            });
        })
        .catch(error => {
            console.error('Error fetching stock news:', error);
            alert('Error fetching news. Please try again later.');
        });
    }
    
    function getDateToday() {
        return new Date().toISOString().split('T')[0];
    }
    
    function getDateOneMonthAgo() {
        const date = new Date();
        date.setMonth(date.getMonth() - 1);
        return date.toISOString().split('T')[0];
    }

    return (
        <div className="stocksBody">
            <div className="navigationBar stocksnavigationBar">
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
                    <div className="navIconANDtxt" >
                        <img className="navIcons" src={bankPic} alt="" />
                        <Link className="navLinks" to="/banking">
                            <p>Banking</p>
                        </Link>
                    </div>
                    <div className="navIconANDtxt" >
                        <img className="navIcons" src={budgetPic} alt="" />
                        <Link className='navLinks' to="/budgeting">
                            <p>Budgeting</p>
                        </Link>
                    </div>
                    <div className="navIconANDtxt" >
                        <img className="navIcons" src={stockPic} alt="" />
                        <Link className='navLinks' to="/stocks">
                            <p>Stocks</p>
                        </Link>
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
                <p className="pageName stkpageName">STOCKS</p>
            </div>

            <div className="stocksContent">
                <div className="stocksTop">
                    <div className="searchandname">
                        <div id="searchArea">
                            <input type="text" id="stockInput" placeholder="Enter a stock symbol (e.g., AAPL)" />
                            <button id="searchButton">Add to favorites</button>
                        </div>
                        <div id="stockButtons" style={{ marginTop: '20px' }}></div>
                        <div id="stockName"></div>
                    </div>
                    <canvas id="stockChart" width="800" height="400"></canvas>
                </div>

                <div id="stockNews"></div>

                <div className="bankFooter stkFtrTxt">
                    <p>
                        Disclosures - THIS Bank, N.A., and its affiliates offer investment products, which may include bank-managed accounts and custody, as part of its trust and fiduciary services. Other investment products and services, such as brokerage and advisory accounts, are offered through THIS Bank LLC, a member of FINRA and SIPC. Insurance products are made available through Chase Insurance Agency, Inc. (CIA), a licensed insurance agency, doing business as Chase Insurance Agency Services, Inc. in Florida. THIS Bank and CIA are affiliated companies under the common control of THIS Bank & Co. Products not available in all states.
                        Please note that the privacy policy and security practices of the linked website may differ from those of THIS Bank, N.A., and its affiliates. It is recommended that customers review the privacy statements and security policies of any third-party websites accessed through this site. THIS Bank, N.A., does not guarantee or endorse the information, recommendations, products, or services offered on third-party sites.
                        Investments in securities: Not FDIC Insured • No Bank Guarantee • May Lose Value. Investing in securities involves risks, and there is always the potential of losing money when you invest in securities. Before investing, consider your investment objectives and THIS Bank's charges and expenses. The investment products sold through THIS Bank and its affiliates are not insured by the FDIC, are not deposits or other obligations of, or guaranteed by, THIS Bank, and are subject to investment risks, including possible loss of the principal amount invested.
                        All loan applications are subject to credit review and approval. Interest rates and terms may vary, and the approval of your loan is based on specific criteria, including your credit history, income, and other factors.
                        THIS Bank is committed to adhering to a strict code of ethics and upholding the highest standards of trust and integrity. Potential conflicts of interest are identified and managed in accordance with our conflict of interest policies and procedures to ensure our clients' interests are protected at all times.
                        For additional information, including details about our products, services, and fees, please contact a THIS Bank representative. By using THIS Bank's services, you agree to our Terms of Use and acknowledge you have read our Privacy Policy.
                    </p>
                </div>

                <div className="ftr stkftr">
                    <div className="ftrLogoCont">
                        <img className="" src="images/logo.jpeg" alt="" />
                    </div>
                    <div className="ftrLinksCont">
                        <p>
                            <span style={{ fontFamily: 'inter', fontSize: '20px', fontWeight: '700' }}>Resources</span><br />
                            <br /><br />How It Works<br />
                            Our Fees<br />
                            Developers<br />
                            Trust and Safety
                        </p>
                        <p>
                            <span style={{ fontFamily: 'inter', fontSize: '20px', fontWeight: '700' }}>Useful Links</span><br />
                            <br /><br />Tips & tricks<br />
                            Manage Balance<br />
                            Ways to get paid<br />
                            Direct deposit
                        </p>
                        <p>
                            <span style={{ fontFamily: 'inter', fontSize: '20px', fontWeight: '700' }}>Company</span><br />
                            <br /><br /> About Us<br />
                            Careers<br />
                            Terms<br />
                            Privacy
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TestStocks;
