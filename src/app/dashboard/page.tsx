import { CreditCardIcon, ArrowUpIcon, ArrowDownIcon, QrCodeIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Balance and Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white">
          <h2 className="text-lg font-medium opacity-80">Total Balance</h2>
          <p className="text-4xl font-bold mt-2">₹2,45,678.00</p>
          <div className="mt-4 flex items-center space-x-2">
            <ArrowUpIcon className="h-5 w-5 text-green-300" />
            <span className="text-green-300">+2.5% from last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 flex flex-col items-center justify-center">
          <button className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium">
            Send Money
          </button>
          <button className="w-full mt-2 py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium">
            Request Money
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Quick Pay</h3>
            <QrCodeIcon className="h-6 w-6 text-gray-400" />
          </div>
          <button className="mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium">
            Scan QR Code
          </button>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Recent Transactions</h2>
          <button className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 text-sm font-medium">
            View All
          </button>
        </div>

        <div className="space-y-4">
          {[
            {
              name: 'Amazon Shopping',
              amount: -2499.00,
              date: 'Today',
              type: 'debit',
              category: 'Shopping'
            },
            {
              name: 'Salary Deposit',
              amount: 75000.00,
              date: 'Yesterday',
              type: 'credit',
              category: 'Income'
            },
            {
              name: 'Netflix Subscription',
              amount: -649.00,
              date: '2 days ago',
              type: 'debit',
              category: 'Entertainment'
            }
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-full ${
                  transaction.type === 'credit' ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'
                }`}>
                  {transaction.type === 'credit' ? (
                    <ArrowUpIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  ) : (
                    <ArrowDownIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">{transaction.name}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${
                  transaction.type === 'credit' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {transaction.type === 'credit' ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">AI Financial Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800">
            <h3 className="font-medium text-blue-900 dark:text-blue-300">Spending Pattern</h3>
            <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
              Your entertainment expenses have increased by 30% this month. Consider reviewing your subscriptions.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800">
            <h3 className="font-medium text-purple-900 dark:text-purple-300">Savings Goal</h3>
            <p className="mt-1 text-sm text-purple-700 dark:text-purple-400">
              You're on track to reach your savings goal of ₹1,00,000 by December 2024.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
