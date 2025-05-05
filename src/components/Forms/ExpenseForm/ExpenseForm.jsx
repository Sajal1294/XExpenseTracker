import styles from './ExpenseForm.module.css';
import Button from '../../Button/Button.jsx';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';

export default function ExpenseForm({ setIsOpen, expenseList, setExpenseList, editId, setBalance, balance }) {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    date: '',
  });

  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      category: '',
      price: '',
      date: '',
    });
  };

  const handleAdd = (e) => {
    e.preventDefault();

    const amount = Number(formData.price);
    if (amount <= 0 || isNaN(amount)) {
      enqueueSnackbar("Price must be a positive number", { variant: "warning" });
      return;
    }

    if (balance < amount) {
      enqueueSnackbar("Price should be less than the wallet balance", { variant: "warning" });
      return;
    }

    const lastId = expenseList.length > 0 ? expenseList[0].id : 0;

    setBalance(prev => prev - amount);
    setExpenseList(prev => [{ ...formData, id: lastId + 1 }, ...prev]);

    enqueueSnackbar("Expense added successfully!", { variant: "success" });
    resetForm();
    setIsOpen(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();

    const amount = Number(formData.price);
    if (amount <= 0 || isNaN(amount)) {
      enqueueSnackbar("Price must be a positive number", { variant: "warning" });
      return;
    }

    const updated = expenseList.map(item => {
      if (item.id === editId) {
        const priceDiff = Number(item.price) - amount;

        if (priceDiff < 0 && Math.abs(priceDiff) > balance) {
          enqueueSnackbar("Price should not exceed the wallet balance", { variant: "warning" });
          return item;
        }

        setBalance(prev => prev + priceDiff);
        return { ...formData, id: editId };
      }
      return item;
    });

    setExpenseList(updated);
    enqueueSnackbar("Expense updated successfully!", { variant: "info" });
    setIsOpen(false);
  };

  useEffect(() => {
    if (editId) {
      const expenseToEdit = expenseList.find(item => item.id === editId);
      if (expenseToEdit) {
        setFormData({
          title: expenseToEdit.title,
          category: expenseToEdit.category,
          price: expenseToEdit.price,
          date: expenseToEdit.date,
        });
      }
    }
  }, [editId]);

  return (
    <div className={styles.formWrapper}>
      <h3>{editId ? 'Edit Expense' : 'Add Expense'}</h3>
      <form onSubmit={editId ? handleEdit : handleAdd}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="" disabled>Select category</option>
          <option value="food">Food</option>
          <option value="entertainment">Entertainment</option>
          <option value="travel">Travel</option>
        </select>

        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />

        <Button type="submit" style="primary" shadow>
          {editId ? 'Edit Expense' : 'Add Expense'}
        </Button>

        <Button
          type="button"
          style="secondary"
          shadow
          handleClick={() => setIsOpen(false)}
        >
          Cancel
        </Button>
      </form>
    </div>
  );
}
