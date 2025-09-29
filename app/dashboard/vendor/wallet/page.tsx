"use client";

import { useState } from "react";
import {
  Wallet,
  Calendar,
} from "lucide-react";
import VendorSidebar from "@/components/dashboard/VendorSidebar";
import SectionWrapper from "@/components/layout/SectionWrapper";
import Pagination from "@/components/ui/Pagination";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { useVendorWallet } from "@/hooks/useAPI";
import { vendorsAPI } from "@/lib/api/vendors";

type Transaction = {
  _id: string;
  title: string;
  description: string;
  amount: number;
  type: "credit" | "debit";
  timestamp: string;
};

function VendorWalletContent() {
  const { data: wallet, isLoading } = useVendorWallet() as {
    data: {
      availableBalance: number;
      thisMonth: number;
      totalEarnings: number;
      transactions: Transaction[];
    };
    isLoading: boolean;
  };

  const [currentTransactionPage, setCurrentTransactionPage] = useState(1);
  const [dateFilter, setDateFilter] = useState("all");
  const transactionsPerPage = 3;

  // Withdraw modal states
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [accountName, setAccountName] = useState(""); // <-- added
  const [bankName, setBankName] = useState("");
  const [gateway, setGateway] = useState("manual"); // You can extend to support others
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading wallet...</p>
      </div>
    );
  }

  if (!wallet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Failed to load wallet data.</p>
      </div>
    );
  }

  // Sort transactions newest first by createdAt date
  const sortedTransactions = [...wallet.transactions].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const totalTransactionPages = Math.ceil(
    sortedTransactions.length / transactionsPerPage
  );

  const startIndex = (currentTransactionPage - 1) * transactionsPerPage;
  const endIndex = startIndex + transactionsPerPage;
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handleWithdraw = async () => {
    setError("");
    setSuccessMsg("");
    const amountNum = Number(withdrawAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Please enter a valid withdrawal amount.");
      return;
    }
    if (amountNum > wallet.availableBalance) {
      setError("Withdrawal amount exceeds available balance.");
      return;
    }
    if (!bankAccount || !bankName || !accountName) {
      setError("Please provide bank account, account name, and bank name.");
      return;
    }

    setIsSubmitting(true);
    try {
      await vendorsAPI.requestWithdrawal({
        amount: amountNum,
        bankAccount,
        accountName, // <-- included here
        bankName,
        gateway: "WALLET",
      });
      setSuccessMsg("Withdrawal request sent successfully!");
      setWithdrawAmount("");
      setBankAccount("");
      setAccountName(""); // <-- reset
      setBankName("");
      setTimeout(() => {
        setWithdrawModalOpen(false);
      }, 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to process withdrawal.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <SectionWrapper className="pt-4 pb-4 md:pt-8 md:pb-8">
        <div className="max-w-7xl mx-auto px-2 md:px-4">
          <div className="flex gap-4 md:gap-8">
            <VendorSidebar />
            <main className="flex-1 bg-white rounded-lg shadow p-3 md:p-6">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">
                Wallet
              </h1>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-4 md:mb-6">
                <div className="bg-gradient-to-r from-[#D7195B] to-[#B01548] text-white rounded-lg p-4 md:p-6">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">
                    Available Balance
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold">
                    ₦{wallet.availableBalance.toLocaleString()}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg p-4 md:p-6">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">
                    This Month
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold">
                    ₦{typeof wallet.thisMonth === "number" ? wallet.thisMonth.toLocaleString() : "0"}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg p-4 md:p-6">
                  <h3 className="font-semibold mb-2 text-sm md:text-base">
                    Total Earnings
                  </h3>
                  <p className="text-2xl md:text-3xl font-bold">
                    ₦{wallet.totalEarnings.toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Withdraw Button */}
              <div className="mb-6">
                <button
                  onClick={() => setWithdrawModalOpen(true)}
                  className="bg-[#D7195B] text-white px-4 py-2 rounded-md hover:bg-[#b01349]"
                >
                  Withdraw Funds
                </button>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
                  <h3 className="font-semibold text-gray-900 text-sm md:text-base">
                    Recent Transactions
                  </h3>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                      className="border border-gray-300 rounded-md px-3 py-1 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-[#D7195B] pr-8"
                    >
                      <option value="all">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                </div>

                {currentTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <Wallet className="w-12 h-12 md:w-16 md:h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                      No transactions yet
                    </h3>
                    <p className="text-sm md:text-base text-gray-600">
                      Your transaction history will appear here.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 md:space-y-4">
                      {currentTransactions.map((transaction) => (
                        <div
                          key={transaction._id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 gap-2"
                        >
                          <div>
                            <p className="font-medium text-gray-900 text-sm md:text-base">
                              {transaction.title}
                            </p>
                            <p className="text-sm text-gray-500">
                              {transaction.description}
                            </p>
                          </div>
                          <div className="text-right">
                            <span
                              className={`font-medium text-sm md:text-base ${
                                transaction.type === "credit"
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {transaction.type === "credit" ? "+" : "-"}₦
                              {transaction.amount.toLocaleString()}
                            </span>
                            <p className="text-xs text-gray-500">
                              {new Date(transaction.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {totalTransactionPages > 1 && (
                      <div className="mt-4 md:mt-6">
                        <Pagination
                          currentPage={currentTransactionPage}
                          totalPages={totalTransactionPages}
                          onPageChange={setCurrentTransactionPage}
                          showPageNumbers={false}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2 text-sm md:text-base">
                    Quick Actions
                  </h4>
                  <div className="space-y-2">
                    {/* You may remove the Withdraw Funds button here to avoid duplicates */}
                    <button
                      onClick={() => setWithdrawModalOpen(true)}
                      className="w-full text-left text-sm text-blue-700 hover:text-blue-800 py-1"
                    >
                      • Withdraw Funds
                    </button>
                    <button className="w-full text-left text-sm text-blue-700 hover:text-blue-800 py-1">
                      • View Transaction History
                    </button>
                    <button className="w-full text-left text-sm text-blue-700 hover:text-blue-800 py-1">
                      • Download Statement
                    </button>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-medium text-green-900 mb-2 text-sm md:text-base">
                    Earnings Tips
                  </h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Promote your products to increase sales</li>
                    <li>• Offer competitive pricing</li>
                    <li>• Provide excellent customer service</li>
                    <li>• Keep your product catalog updated</li>
                  </ul>
                </div>
              </div>
            </main>
          </div>
        </div>
      </SectionWrapper>

      {/* Withdraw Modal */}
      {withdrawModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Request Withdrawal</h2>

            {error && <p className="text-red-600 mb-3">{error}</p>}
            {successMsg && <p className="text-green-600 mb-3">{successMsg}</p>}

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Amount (₦)
              <input
                type="number"
                min="1"
                max={wallet.availableBalance}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={isSubmitting}
              />
            </label>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Bank Account Number
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={isSubmitting}
              />
            </label>

            <label className="block mb-2 text-sm font-medium text-gray-700">
              Account Name
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={isSubmitting}
              />
            </label>

            <label className="block mb-4 text-sm font-medium text-gray-700">
              Bank Name
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                disabled={isSubmitting}
              />
            </label>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  if (!isSubmitting) setWithdrawModalOpen(false);
                  setError("");
                  setSuccessMsg("");
                }}
                className="px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                onClick={handleWithdraw}
                className="bg-[#D7195B] text-white px-4 py-2 rounded-md hover:bg-[#b01349]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VendorWalletPage() {
  return (
    <AuthWrapper requireAuth={true}>
      <VendorWalletContent />
    </AuthWrapper>
  );
}
