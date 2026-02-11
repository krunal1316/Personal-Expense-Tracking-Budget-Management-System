import React, { useState } from 'react';
import './Sidebar.css';

function Sidebar({ transactions, user }) {
    const [isOpen, setIsOpen] = useState(false);
    const [showDetails, setShowDetails] = useState(false);
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const handleDownload = () => {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();

        const filteredTransactions = transactions.filter(t => {
            const date = new Date(t.createdAt || t.date);
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        if (filteredTransactions.length === 0) {
            alert("No transactions found for the current month.");
            return;
        }

        const csvContent = "data:text/csv;charset=utf-8,"
            + "Date,Text,Amount,Category\n"
            + filteredTransactions.map(e => `${new Date(e.createdAt || e.date).toLocaleDateString()},${e.text},${e.amount},${e.category}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `transactions_${currentMonth + 1}_${currentYear}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleShare = async () => {
        const shareData = {
            title: 'Expense Tracker History',
            text: `Check out my expense history for this month!`,
            url: window.location.href
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                const textToCopy = transactions.map(t => `${t.text}: ${t.amount} (${t.category})`).join('\n');
                await navigator.clipboard.writeText(textToCopy);
                alert("Transaction history copied to clipboard!");
            }
        } catch (err) {
            console.error("Error sharing:", err);
        }
    };

    const handleDetails = () => {
        setShowDetails(true);
        setIsOpen(false);
    };

    const handleCalendar = () => {
        setShowCalendar(true);
        setIsOpen(false);
    };

    const closeDetails = () => {
        setShowDetails(false);
    };

    const closeCalendar = () => {
        setShowCalendar(false);
    };

    // Calculate details for modal (Total / Current view)
    // For "Every Detail", it could be ALL time or Current Month. 
    // Let's assume All Time for "Every Detail" based on previous implementation.
    const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
    const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);

    const categoryBreakdown = transactions.reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
    }, {});


    // Calculate details for CALENDAR modal
    const getCalendarData = () => {
        const [year, month] = selectedMonth.split('-');

        const filtered = transactions.filter(t => {
            const date = new Date(t.createdAt || t.date);
            return date.getFullYear() === parseInt(year) && date.getMonth() === parseInt(month) - 1;
        });

        const calIncome = filtered.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
        const calExpense = filtered.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);

        const calCategoryBreakdown = filtered.reduce((acc, t) => {
            if (t.amount < 0) { // Only showing expense breakdown usually makes sense, but let's do net
                acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
            }
            return acc;
        }, {});

        return { filtered, calIncome, calExpense, calCategoryBreakdown };
    };

    const { filtered: calendarTransactions, calIncome, calExpense, calCategoryBreakdown } = getCalendarData();

    return (
        <>
            <button className="sidebar-toggle" onClick={toggleSidebar}>
                ☰
            </button>

            {/* Sidebar */}
            <div className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h3>Menu</h3>
                    <button className="close-btn" onClick={toggleSidebar}>×</button>
                </div>
                <ul className="sidebar-links">
                    <li onClick={handleDownload}><i className="fa-solid fa-download"></i> Download History</li>
                    <li onClick={handleShare}><i className="fa-solid fa-share-nodes"></i> Share History</li>
                    <li onClick={handleDetails}><i className="fa-solid fa-circle-info"></i> Every Detail</li>
                    <li onClick={handleCalendar}><i className="fa-solid fa-calendar-days"></i> Calendar View</li>
                </ul>
                <div className="sidebar-footer">
                    <p>User: {user}</p>
                </div>
            </div>

            {/* Details Modal (All Time) */}
            {showDetails && (
                <div className="details-modal-overlay">
                    <div className="details-modal">
                        <div className="details-header">
                            <h2>Detailed Report (All Time)</h2>
                            <button className="close-details-btn" onClick={closeDetails}>×</button>
                        </div>
                        <div className="details-content">
                            <div className="summary-section">
                                <div className="detail-item income">
                                    <span>Total Income</span>
                                    <strong>₹{income}</strong>
                                </div>
                                <div className="detail-item expense">
                                    <span>Total Expense</span>
                                    <strong>₹{expense}</strong>
                                </div>
                                <div className="detail-item balance">
                                    <span>Net Balance</span>
                                    <strong>₹{income - expense}</strong>
                                </div>
                            </div>

                            <h4>Category Breakdown</h4>
                            <div className="category-list">
                                {Object.entries(categoryBreakdown).map(([cat, amt]) => (
                                    <div key={cat} className="category-item">
                                        <span>{cat}</span>
                                        <span className={amt >= 0 ? 'text-success' : 'text-danger'}>
                                            ₹{Math.abs(amt)} {amt >= 0 ? '(Inc)' : '(Exp)'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar Modal */}
            {showCalendar && (
                <div className="details-modal-overlay">
                    <div className="details-modal">
                        <div className="details-header">
                            <h2>Monthly Report</h2>
                            <button className="close-details-btn" onClick={closeCalendar}>×</button>
                        </div>
                        <div className="details-content">
                            <div className="month-selector-container">
                                <label>Select Month: </label>
                                <input
                                    type="month"
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="month-input"
                                />
                            </div>

                            <div className="summary-section">
                                <div className="detail-item income">
                                    <span>Income</span>
                                    <strong>₹{calIncome}</strong>
                                </div>
                                <div className="detail-item expense">
                                    <span>Expense</span>
                                    <strong>₹{calExpense}</strong>
                                </div>
                                <div className="detail-item balance">
                                    <span>Balance</span>
                                    <strong>₹{calIncome - calExpense}</strong>
                                </div>
                            </div>

                            <h4>Expense Breakdown ({new Date(selectedMonth).toLocaleString('default', { month: 'long', year: 'numeric' })})</h4>
                            {Object.keys(calCategoryBreakdown).length > 0 ? (
                                <div className="category-list">
                                    {Object.entries(calCategoryBreakdown).map(([cat, amt]) => (
                                        <div key={cat} className="category-item">
                                            <span>{cat}</span>
                                            <span className="text-danger">
                                                -₹{amt}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="no-data-msg">No expenses found for this month.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default Sidebar;
