import styles from './AddBalanceForm.module.css';
import Button from '../../Button/Button.jsx';
import { useState } from 'react';
import { useSnackbar } from 'notistack';

export default function AddBalanceForm({ setIsOpen, setBalance }) {
  const [income, setIncome] = useState('');
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = (e) => {
    e.preventDefault();

    const amount = Number(income);

    if (!income || isNaN(amount) || amount <= 0) {
      enqueueSnackbar('Please enter a valid positive amount', { variant: 'warning' });
      return;
    }

    setBalance((prev) => prev + amount);
    enqueueSnackbar('Balance added successfully!', { variant: 'success' });
    setIsOpen(false);
  };

  return (
    <div className={styles.formWrapper}>
      <h3>Add Balance</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Income Amount"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          required
        />

        <Button type="submit" style="primary" shadow>
          Add Balance
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
