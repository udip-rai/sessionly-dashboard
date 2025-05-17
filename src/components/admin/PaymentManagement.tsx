import { useState } from 'react';
import { FiDollarSign, FiTrendingUp, FiAlertCircle, FiDownload, FiFilter, FiSearch, FiExternalLink, FiCheckCircle, FiXCircle } from 'react-icons/fi';

interface Transaction {
  id: string;
  date: string;
  amount: number;
  type: 'payment' | 'refund' | 'payout';
  status: 'completed' | 'pending' | 'failed' | 'disputed';
  studentName: string;
  expertName: string;
  sessionId: string;
  paymentMethod: string;
  disputeReason?: string;
  refundReason?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: 'txn_1',
    date: '2025-05-10T14:30:00',
    amount: 150.00,
    type: 'payment',
    status: 'completed',
    studentName: 'John Smith',
    expertName: 'Dr. Sarah Johnson',
    sessionId: 'sess_123',
    paymentMethod: 'Visa ***1234'
  },
  {
    id: 'txn_2',
    date: '2025-05-09T10:15:00',
    amount: 75.00,
    type: 'refund',
    status: 'completed',
    studentName: 'Emily Brown',
    expertName: 'Michael Wilson',
    sessionId: 'sess_124',
    paymentMethod: 'Mastercard ***5678',
    refundReason: 'Session cancelled by expert'
  },
  {
    id: 'txn_3',
    date: '2025-05-08T16:45:00',
    amount: 200.00,
    type: 'payment',
    status: 'disputed',
    studentName: 'Alice Johnson',
    expertName: 'Dr. Robert Lee',
    sessionId: 'sess_125',
    paymentMethod: 'PayPal',
    disputeReason: 'Service not as described'
  }
];

export function PaymentManagement() {
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState('7d');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isRefundModalOpen, setIsRefundModalOpen] = useState(false);

  const stats = {
    totalRevenue: transactions
      .filter(t => t.type === 'payment' && t.status === 'completed')
      .reduce((sum, t) => sum + t.amount, 0),
    totalRefunds: transactions
      .filter(t => t.type === 'refund')
      .reduce((sum, t) => sum + t.amount, 0),
    disputeRate: ((transactions.filter(t => t.status === 'disputed').length / transactions.length) * 100).toFixed(1),
    pendingDisputes: transactions.filter(t => t.status === 'disputed').length
  };

  const handleRefund = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsRefundModalOpen(true);
  };

  const processRefund = (reason: string) => {
    if (!selectedTransaction) return;
    
    const refund: Transaction = {
      id: `txn_ref_${Date.now()}`,
      date: new Date().toISOString(),
      amount: selectedTransaction.amount,
      type: 'refund',
      status: 'completed',
      studentName: selectedTransaction.studentName,
      expertName: selectedTransaction.expertName,
      sessionId: selectedTransaction.sessionId,
      paymentMethod: selectedTransaction.paymentMethod,
      refundReason: reason
    };

    setTransactions([refund, ...transactions]);
    setIsRefundModalOpen(false);
    setSelectedTransaction(null);
  };

  const resolveDispute = (transaction: Transaction, resolution: 'approve' | 'deny') => {
    setTransactions(transactions.map(t =>
      t.id === transaction.id
        ? { ...t, status: resolution === 'approve' ? 'completed' : 'failed' }
        : t
    ));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Payment Management</h1>
        <p className="text-gray-600 mt-2">Monitor transactions, process refunds, and handle disputes</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ${stats.totalRevenue.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-navy/5 rounded-lg">
              <FiDollarSign className="w-6 h-6 text-navy" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Refunds</p>
              <h3 className="text-2xl font-semibold text-gray-900">
                ${stats.totalRefunds.toLocaleString()}
              </h3>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <FiTrendingUp className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Dispute Rate</p>
              <h3 className="text-2xl font-semibold text-gray-900">{stats.disputeRate}%</h3>
            </div>
            <div className="p-3 bg-yellow-50 rounded-lg">
              <FiAlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Disputes</p>
              <h3 className="text-2xl font-semibold text-gray-900">{stats.pendingDisputes}</h3>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <FiAlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy"
              />
            </div>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-navy focus:border-navy p-2"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="all">All time</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-600 hover:text-navy">
              <FiFilter className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-600 hover:text-navy">
              <FiDownload className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Transaction
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Student
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expert
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={`p-2 rounded-lg mr-3 ${
                      transaction.type === 'payment'
                        ? 'bg-green-100'
                        : transaction.type === 'refund'
                        ? 'bg-orange-100'
                        : 'bg-gray-100'
                    }`}>
                      <FiDollarSign className={`w-4 h-4 ${
                        transaction.type === 'payment'
                          ? 'text-green-600'
                          : transaction.type === 'refund'
                          ? 'text-orange-600'
                          : 'text-gray-600'
                      }`} />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.paymentMethod}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(transaction.date).toLocaleDateString()}
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(transaction.date).toLocaleTimeString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    ${transaction.amount.toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    transaction.status === 'completed'
                      ? 'bg-green-100 text-green-800'
                      : transaction.status === 'disputed'
                      ? 'bg-red-100 text-red-800'
                      : transaction.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.studentName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {transaction.expertName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {transaction.status === 'disputed' ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => resolveDispute(transaction, 'approve')}
                        className="text-green-600 hover:text-green-700"
                      >
                        <FiCheckCircle className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => resolveDispute(transaction, 'deny')}
                        className="text-red-600 hover:text-red-700"
                      >
                        <FiXCircle className="w-5 h-5" />
                      </button>
                    </div>
                  ) : transaction.type === 'payment' && transaction.status === 'completed' ? (
                    <button
                      onClick={() => handleRefund(transaction)}
                      className="text-navy hover:text-navy/80"
                    >
                      Issue Refund
                    </button>
                  ) : (
                    <button className="text-navy hover:text-navy/80">
                      <FiExternalLink className="w-5 h-5" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Refund Modal */}
      {isRefundModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Issue Refund</h3>
            <p className="text-sm text-gray-600 mb-4">
              You are about to refund ${selectedTransaction.amount.toFixed(2)} to {selectedTransaction.studentName}
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reason for Refund
              </label>
              <select
                className="w-full rounded-lg border-gray-200 text-sm focus:border-navy focus:ring-navy"
                defaultValue=""
              >
                <option value="" disabled>Select a reason</option>
                <option value="session_cancelled">Session Cancelled</option>
                <option value="quality_issues">Quality Issues</option>
                <option value="technical_problems">Technical Problems</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsRefundModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => processRefund('Session Cancelled')}
                className="px-4 py-2 bg-navy text-white text-sm font-medium rounded-lg hover:bg-navy/90"
              >
                Confirm Refund
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}