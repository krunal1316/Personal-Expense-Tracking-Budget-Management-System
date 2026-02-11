import React, { useState } from 'react'
import { handleError } from '../utils';

function ExpenseForm({ addTransaction }) {

    const [expenseInfo, setExpenseInfo] = useState({
        amount: '',
        text: '',
        category: ''
    })

    const handleChange = (e) => {
        const { name, value } = e.target;
        const copyExpenseInfo = { ...expenseInfo };
        copyExpenseInfo[name] = value;
        setExpenseInfo(copyExpenseInfo);
    }

    const addExpenses = (e) => {
        e.preventDefault();
        const { amount, text, category } = expenseInfo;
        // Logic to determine if it's income or expense based on user intent is handled by the buttons below
        // But since we have a single form submit, let's assume the user enters a positive number
        // and clicks strict "Add Expense" or "Add Income" buttons which might need to be separate actions
        // OR we just rely on the user entering +/- (but the design has specific buttons).

        // Let's change the approach: Two buttons "Add Expense" and "Add Income"
        // We can't use the form onSubmit for both easily without knowing which button was clicked.
        // We'll handle it in the button click handlers.
    }

    const handleTransaction = (type, e) => {
        e.preventDefault();
        const { amount, text, category } = expenseInfo;
        if (!amount || !text || !category) {
            handleError('Please add Expense Details and Category');
            return;
        }

        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) {
            handleError('Please enter a valid amount');
            return;
        }

        const finalAmount = type === 'expense' ? -Math.abs(numericAmount) : Math.abs(numericAmount);

        // Optional: If 'additional' type is clicked, we could force category change or validtion here
        // Current logic relies on user selecting category.

        addTransaction({
            ...expenseInfo,
            amount: finalAmount
        });

        setExpenseInfo({ amount: '', text: '', category: '' })
    }

    return (
        <div className='container'>
            <h2 className='mb-3'>Add Transaction</h2>
            <form>
                <div className='form-group'>
                    <label htmlFor='text' className='form-label'>Description</label>
                    <input
                        onChange={handleChange}
                        type='text'
                        name='text'
                        className='form-control'
                        placeholder='What is this transaction for?'
                        value={expenseInfo.text}
                    />
                </div>

                <div className='dashboard-grid' style={{ gridTemplateColumns: '1fr 1fr', marginTop: '10px', marginBottom: '10px', gap: '1rem' }}>
                    <div className='form-group' style={{ margin: 0 }}>
                        <label htmlFor='amount' className='form-label'>Amount</label>
                        <input
                            onChange={handleChange}
                            type='number'
                            name='amount'
                            className='form-control'
                            placeholder='0.00'
                            value={expenseInfo.amount}
                        />
                    </div>
                    <div className='form-group' style={{ margin: 0 }}>
                        <label htmlFor='category' className='form-label'>Category</label>
                        <select
                            onChange={handleChange}
                            name='category'
                            className='form-control'
                            value={expenseInfo.category}
                        >
                            <option value='' disabled>Select category</option>
                            <option value='Food'>Food</option>
                            <option value='Rent'>Rent</option>
                            <option value='Salary'>Salary</option>
                            <option value='Transport'>Transport</option>
                            <option value='Entertainment'>Entertainment</option>
                            <option value='Medical'>Medical</option>
                            <option value='Utilities'>Utilities</option>
                            <option value='Shopping'>Shopping</option>
                            <option value='Other'>Other</option>
                        </select>
                    </div>
                </div>

                <div className='d-flex gap-2' style={{ marginTop: '1rem' }}>
                    <button className='btn btn-danger btn-block' style={{ flex: 1 }} onClick={(e) => handleTransaction('expense', e)}>
                        - Expense
                    </button>
                    <button className='btn btn-success btn-block' style={{ flex: 1, backgroundColor: '#28a745', borderColor: '#28a745' }} onClick={(e) => handleTransaction('income', e)}>
                        + Income
                    </button>
                    <button className='btn btn-info btn-block' style={{ flex: 1, backgroundColor: '#17a2b8', borderColor: '#17a2b8', color: 'white' }} onClick={(e) => handleTransaction('additional', e)}>
                        + Add'l
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ExpenseForm