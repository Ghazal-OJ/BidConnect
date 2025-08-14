import { useState } from 'react';
import axios from 'axios';

export default function BidForm({ projectId, onClose }) {
  const [amount, setAmount] = useState('');
  const [coverLetter, setCoverLetter] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    await axios.post(`/api/projects/${projectId}/bids`, { amount: Number(amount), coverLetter });
    onClose?.();
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="Your bid amount" required />
      <textarea value={coverLetter} onChange={e=>setCoverLetter(e.target.value)} placeholder="Short cover letter" required />
      <div className="flex gap-2">
        <button type="submit" className="btn">Send Bid</button>
        <button type="button" className="btn" onClick={onClose}>Cancel</button>
      </div>
    </form>
  );
}
