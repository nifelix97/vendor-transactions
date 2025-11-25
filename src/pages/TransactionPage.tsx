import { useMemo, useState } from 'react';
import { FaCheckCircle, FaClock, FaTimesCircle } from 'react-icons/fa';
import EmptyState from '../components/EmptyState';
import ErrorMessage from '../components/ErrorMessage';
import LoadingSkeleton from '../components/LoadingSkeleton';
import SummaryCard from '../components/SummaryCard';
import { useTransactions } from '../hooks/useTransactions';

const TransactionPage = () => {
  const { data, isLoading, error, refetch } = useTransactions();
  const [activeTab, setActiveTab] = useState<'all' | 'cash_in' | 'cash_out'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'pending' | 'failed'>('all');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const itemsPerPage = 6;

  const stats = useMemo(() => {
    if (!data) return { totalIncome: 0, totalExpenses: 0, netBalance: 0 };
    
    const income = data.transactions
      .filter(t => t.type === 'cash_in')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = data.transactions
      .filter(t => t.type !== 'cash_in')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      totalIncome: income,
      totalExpenses: expenses,
      netBalance: data.total_balance
    };
  }, [data]);

  const filteredTransactions = useMemo(() => {
    if (!data) return [];
    
    let filtered = data.transactions;
    
    if (activeTab === 'cash_in') {
      filtered = filtered.filter(t => t.type === 'cash_in');
    } else if (activeTab === 'cash_out') {
      filtered = filtered.filter(t => t.type !== 'cash_in');
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.recipient.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [data, activeTab, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  
  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredTransactions.slice(startIndex, endIndex);
  }, [filteredTransactions, currentPage]);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, statusFilter]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return { icon: FaCheckCircle, color: 'text-primary-50' };
      case 'pending':
        return { icon: FaClock, color: 'text-secondary-50' };
      case 'failed':
        return { icon: FaTimesCircle, color: 'text-red-500' };
      default:
        return { icon: FaClock, color: 'text-gray-700' };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 animate-pulse">
            <div className="mb-2 h-8 w-48 rounded bg-gray-200" />
            <div className="h-4 w-64 rounded bg-gray-200" />
          </div>
          <LoadingSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <ErrorMessage message={error.message} onRetry={refetch} />
        </div>
      </div>
    );
  }

  if (!data || data.transactions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">
          <EmptyState />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-3 pt-16 xs:p-4 xs:pt-16 sm:p-6 md:p-8 lg:pt-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="mb-1 text-xl xs:text-2xl sm:text-3xl font-bold text-primary-50">
            Financial Records
          </h1>
          <p className="text-xs xs:text-sm text-gray-500">
            Track and manage income and expenses
          </p>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 sm:mb-8 grid grid-cols-2 xs:grid-cols-2 gap-3 xs:gap-4 sm:gap-5 md:gap-6 lg:grid-cols-3">
          <SummaryCard
            title="TOTAL INCOME"
            amount={stats.totalIncome}
            currency={data.currency}
            subtitle="From cash in"
            iconColor="bg-primary-50/40"
            icon={
              <svg
                className="h-5 w-5 text-secondary-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
          />
          <SummaryCard
            title="TOTAL EXPENSES"
            amount={stats.totalExpenses}
            currency={data.currency}
            subtitle="All expenses"
            iconColor="bg-red-50"
            icon={
              <svg
                className="h-5 w-5 text-red-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 12H4"
                />
              </svg>
            }
          />
          <SummaryCard
            title="TOTAL BALANCE"
            amount={stats.netBalance}
            currency={data.currency}
            subtitle={stats.netBalance < 0 ? "Deficit" : "Surplus"}
            iconColor="bg-green-50"
            amountColor={
              stats.netBalance < 0 ? "text-red-600" : "text-green-600"
            }
            icon={
              <svg
                className="h-5 w-5 text-primary-50"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                />
              </svg>
            }
          />
        </div>

        {/* Tabs */}
        <div className="mb-4 sm:mb-6 border-b border-gray-200 overflow-x-auto">
          <div className="flex gap-4 xs:gap-6 sm:gap-8 min-w-max sm:min-w-0">
            <button
              onClick={() => setActiveTab("all")}
              className={`pb-2 sm:pb-3 text-xs xs:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "all"
                  ? "border-b-2 border-secondary-50 text-secondary-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              All Transactions
            </button>
            <button
              onClick={() => setActiveTab("cash_in")}
              className={`pb-2 sm:pb-3 text-xs xs:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "cash_in"
                  ? "border-b-2 border-secondary-50 text-secondary-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Income
            </button>
            <button
              onClick={() => setActiveTab("cash_out")}
              className={`pb-2 sm:pb-3 text-xs xs:text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === "cash_out"
                  ? "border-b-2 border-secondary-50 text-secondary-50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Expenses
            </button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="mb-4 sm:mb-6 flex flex-col gap-3 xs:gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-full sm:max-w-md">
            <svg
              className="absolute left-2 xs:left-3 top-1/2 h-4 xs:h-5 w-4 xs:w-5 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-8 xs:pl-10 pr-3 xs:pr-4 text-xs xs:text-sm focus:border-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-50/20"
            />
          </div>
          <div className="relative flex gap-2">
            <div className="relative">
              <button 
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="inline-flex items-center gap-1.5 xs:gap-2 rounded-lg border border-gray-300 bg-white px-3 xs:px-4 py-2 text-xs xs:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                <svg
                  className="h-3.5 xs:h-4 w-3.5 xs:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
                <span className="hidden xs:inline">
                  {statusFilter === 'all' ? 'All Status' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                </span>
                <span className="xs:hidden">Filter</span>
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isStatusDropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-lg border border-gray-200 bg-white shadow-lg z-10">
                  <div className="py-1">
                    {['all', 'success', 'pending', 'failed'].map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status as 'all' | 'success' | 'pending' | 'failed');
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2 text-left text-sm transition-colors ${
                          statusFilter === status
                            ? 'bg-primary-50 text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {status === 'all' ? 'All Status' : status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Receipt #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Recipient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Method
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {paginatedTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="transition-colors hover:bg-gray-50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-primary-50">
                      {transaction.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {transaction.recipient}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {transaction.type
                        .replace("_", " ")
                        .charAt(0)
                        .toUpperCase() +
                        transaction.type.replace("_", " ").slice(1)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-primary-50">
                      {data.currency} {transaction.amount.toLocaleString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {transaction.type === "cash_in"
                        ? "Bank Transfer"
                        : "Mobile Money"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-600">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      {(() => {
                        const { icon: Icon, color } = getStatusIcon(
                          transaction.status
                        );
                        return (
                          <Icon
                            className={`h-5 w-5 ${color}`}
                            title={
                              transaction.status.charAt(0).toUpperCase() +
                              transaction.status.slice(1)
                            }
                          />
                        );
                      })()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {filteredTransactions.length > 0 && totalPages > 1 && (
          <div className="mt-4 sm:mt-6 flex flex-col xs:flex-row items-center justify-between gap-3 xs:gap-4 rounded-xl border border-gray-200 bg-white px-3 xs:px-4 sm:px-6 py-3 sm:py-4 shadow-sm">
            <div className="text-xs xs:text-sm text-gray-600 text-center xs:text-left">
              <span className="hidden sm:inline">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredTransactions.length
                )}{" "}
                of {filteredTransactions.length} transactions
              </span>
              <span className="sm:hidden">
                {(currentPage - 1) * itemsPerPage + 1}-
                {Math.min(
                  currentPage * itemsPerPage,
                  filteredTransactions.length
                )}{" "}
                of {filteredTransactions.length}
              </span>
            </div>
            <div className="flex items-center gap-1 xs:gap-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 xs:gap-2 rounded-lg border border-gray-300 bg-white px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              >
                <svg
                  className="h-3.5 xs:h-4 w-3.5 xs:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden xs:inline">Previous</span>
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-8 w-8 xs:h-9 xs:w-9 sm:h-10 sm:w-10 rounded-lg text-xs xs:text-sm font-medium transition-colors ${
                        currentPage === page
                          ? "bg-secondary-50 text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 xs:gap-2 rounded-lg border border-gray-300 bg-white px-2 xs:px-3 sm:px-4 py-1.5 xs:py-2 text-xs xs:text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white"
              >
                <span className="hidden xs:inline">Next</span>
                <svg
                  className="h-3.5 xs:h-4 w-3.5 xs:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {filteredTransactions.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-gray-500">
              No transactions found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionPage;
