import React from 'react';

const ExpenseTable = ({ expenses, deleteExpens }) => {

    // Helper to get icon based on category
    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Food': return <i className="fa-solid fa-utensils"></i>;
            case 'Rent': return <i className="fa-solid fa-house"></i>;
            case 'Salary': return <i className="fa-solid fa-money-bill-wave"></i>;
            case 'Transport': return <i className="fa-solid fa-car"></i>;
            case 'Entertainment': return <i className="fa-solid fa-film"></i>;
            case 'Medical': return <i className="fa-solid fa-briefcase-medical"></i>;
            case 'Utilities': return <i className="fa-solid fa-bolt"></i>;
            case 'Shopping': return <i className="fa-solid fa-bag-shopping"></i>;
            default: return <i className="fa-solid fa-circle-question"></i>;
        }
    };

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <h2 className="mb-3">Transaction History</h2>
            <div className="expense-list">
                {expenses.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', padding: '20px' }}>
                        No transactions yet. Add your first transaction above!
                    </div>
                ) : (
                    expenses.map((expense, index) => (
                        <div key={index} className="expense-item" style={{
                            padding: '1rem',
                            marginBottom: '10px',
                            background: '#fff',
                            borderRadius: '12px',
                            boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            border: '1px solid var(--border)'
                        }}>
                            <div className="d-flex align-items-center gap-2">
                                <div style={{
                                    width: '50px',
                                    height: '50px',
                                    borderRadius: '50%',
                                    background: expense.amount > 0 ? 'rgba(40, 199, 111, 0.15)' : 'rgba(234, 84, 85, 0.15)',
                                    color: expense.amount > 0 ? 'var(--success)' : 'var(--danger)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '1.2rem',
                                    marginRight: '1rem'
                                }}>
                                    {getCategoryIcon(expense.category || 'Other')}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontWeight: '600', fontSize: '1.1rem' }}>{expense.text}</span>
                                    <span style={{ fontSize: '0.85rem', color: '#888' }}>
                                        {new Date(expense.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>

                            <div className="d-flex align-items-center gap-2">
                                <div
                                    className="expense-amount"
                                    style={{
                                        color: expense.amount > 0 ? 'var(--success)' : 'var(--danger)',
                                        fontWeight: '700',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    {expense.amount > 0 ? '+' : ''}{expense.amount}
                                </div>
                                <button className="delete-button" style={{
                                    marginLeft: '1rem',
                                    background: '#ff4d4d',
                                    color: 'white',
                                    border: 'none',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                    fontSize: '0.8rem'
                                }} onClick={() => deleteExpens(expense._id)}>
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ExpenseTable;
