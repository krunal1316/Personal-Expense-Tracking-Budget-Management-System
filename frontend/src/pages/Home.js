import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { APIUrl, handleError, handleSuccess } from '../utils';
import { ToastContainer } from 'react-toastify';
import ExpenseTable from './ExpenseTable';
import ExpenseForm from './ExpenseForm';

import Sidebar from '../components/Sidebar';

function Home() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [expenses, setExpenses] = useState([]);
    const [monthlyIncome, setMonthlyIncome] = useState(0);
    const [additionalIncome, setAdditionalIncome] = useState(0);
    const [expenseAmt, setExpenseAmt] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        setLoggedInUser(localStorage.getItem('loggedInUser'))
    }, [])

    const handleLogout = (e) => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        handleSuccess('User Loggedout');
        setTimeout(() => {
            navigate('/login');
        }, 1000)
    }

    const resetData = async () => {
        if (!window.confirm("Are you sure you want to reset all data? This cannot be undone.")) return;
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                method: "DELETE" // This now maps to deleteAllTransactions if no ID provided, or we need to ensure route matches
            }
            // Wait, my backend route for delete all is router.delete('/', deleteAllTransactions);
            // And delete single is router.delete('/:expenseId', deleteTransaction);
            // So fetch(url, ...) where url is .../expenses should hit delete all.
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message);
            setExpenses([]);
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        // Calculate Monthly Income (Salary) vs Additional Income (Others)
        const incomeTransactions = expenses.filter(item => item.amount > 0);

        const mIncome = incomeTransactions
            .filter(item => item.category === 'Salary')
            .reduce((acc, item) => acc + item.amount, 0);

        const addIncome = incomeTransactions
            .filter(item => item.category !== 'Salary')
            .reduce((acc, item) => acc + item.amount, 0);

        const exp = expenses
            .filter(item => item.amount < 0)
            .reduce((acc, item) => acc + item.amount, 0) * -1;

        setMonthlyIncome(mIncome);
        setAdditionalIncome(addIncome);
        setExpenseAmt(exp);
    }, [expenses])

    const deleteExpens = async (id) => {
        try {
            const url = `${APIUrl}/expenses/${id}`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                },
                method: "DELETE"
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message)
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }

    const fetchExpenses = async () => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }

    const addTransaction = async (data) => {
        try {
            const url = `${APIUrl}/expenses`;
            const headers = {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify(data)
            }
            const response = await fetch(url, headers);
            if (response.status === 403) {
                localStorage.removeItem('token');
                navigate('/login');
                return
            }
            const result = await response.json();
            handleSuccess(result?.message)
            console.log('--result', result.data);
            setExpenses(result.data);
        } catch (err) {
            handleError(err);
        }
    }

    useEffect(() => {
        fetchExpenses()
    }, [])

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <Sidebar transactions={expenses} user={loggedInUser} />
            <div className='user-section d-flex justify-content-between align-items-center mb-3'>
                <h1>Welcome, {loggedInUser}</h1>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className='btn btn-danger' onClick={resetData} style={{ background: '#e74c3c' }}>Reset Data</button>
                    <button className='btn btn-primary' onClick={handleLogout}>Logout</button>
                </div>
            </div>

            {/* Dashboard Stats */}
            <div className="dashboard-grid">
                <div className="card stat-card">
                    <div className="stat-content">
                        <h3>Monthly Income</h3>
                        <p className="text-success">₹{monthlyIncome}</p>
                    </div>
                    <div className="stat-icon icon-income">
                        <i className="fa-solid fa-dollar-sign"></i>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-content">
                        <h3>Total Expenses</h3>
                        <p className="text-danger">₹{expenseAmt}</p>
                    </div>
                    <div className="stat-icon icon-expense">
                        <i className="fa-solid fa-arrow-trend-down"></i>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-content">
                        <h3>Additional Income</h3>
                        <p className="text-info">₹{additionalIncome}</p>
                    </div>
                    <div className="stat-icon" style={{ background: 'rgba(0, 207, 232, 0.15)', color: 'var(--info)' }}>
                        <i className="fa-solid fa-arrow-trend-up"></i>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-content">
                        <h3>Current Balance</h3>
                        <p className="text-success">₹{(monthlyIncome + additionalIncome) - expenseAmt}</p>
                    </div>
                    <div className="stat-icon icon-balance">
                        <i className="fa-solid fa-wallet"></i>
                    </div>
                </div>
            </div>

            <ExpenseForm addTransaction={addTransaction} />
            <ExpenseTable expenses={expenses} deleteExpens={deleteExpens} />
            <ToastContainer />
        </div>
    )
}

export default Home