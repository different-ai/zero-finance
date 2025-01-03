import React from 'react';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  const [requestId, setRequestId] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (requestId) {
      navigate(`/invoice/${requestId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Request Network Invoice Viewer</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label htmlFor="requestId" className="block text-sm font-medium mb-2">
            Enter Request ID
          </label>
          <input
            type="text"
            id="requestId"
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="Enter Request ID to view invoice"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          disabled={!requestId}
        >
          View Invoice
        </button>
      </form>
    </div>
  );
}
