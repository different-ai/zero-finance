/** @jsxImportSource react */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InvoiceViewer } from './components/invoice-viewer';
import { HomePage } from './pages/home';
import './index.css';

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-background">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/invoice/:requestId" element={<InvoiceViewer />} />
          </Routes>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
