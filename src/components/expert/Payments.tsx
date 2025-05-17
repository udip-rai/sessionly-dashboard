import { FiEdit2 } from 'react-icons/fi';
import { BsCheckCircleFill } from 'react-icons/bs';

export function Payments() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Payments</h1>
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-medium text-gray-900">Payment Method</h2>
            <div className="flex items-center text-sm text-green-600">
              <BsCheckCircleFill className="w-4 h-4 mr-1.5" />
              Verified
            </div>
          </div>
          
          {/* Premium Credit Card Display */}
          <div className="mb-6">
            <div className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-6 rounded-xl text-white shadow-lg max-w-md overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full">
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_70%)]"></div>
                </div>
              </div>
              <div className="absolute top-4 right-4">
                <svg className="h-8 w-auto" viewBox="0 0 80 40" fill="none">
                  <circle cx="60" cy="20" r="20" fill="#FFA500" opacity="0.8"/>
                  <circle cx="40" cy="20" r="20" fill="#FF4500" opacity="0.8"/>
                </svg>
              </div>
              <div className="relative space-y-4">
                <div className="flex items-center space-x-2">
                  <svg className="h-8" viewBox="0 0 36 20" fill="none">
                    <path d="M33 0H3C1.34315 0 0 1.34315 0 3V17C0 18.6569 1.34315 20 3 20H33C34.6569 20 36 18.6569 36 17V3C36 1.34315 34.6569 0 33 0Z" fill="url(#paint0_linear)"/>
                    <defs>
                      <linearGradient id="paint0_linear" x1="18" y1="0" x2="18" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#FFD700"/>
                        <stop offset="1" stopColor="#FFA500"/>
                      </linearGradient>
                    </defs>
                  </svg>
                  <span className="text-xs font-medium uppercase tracking-wider">Premium</span>
                </div>
                <p className="font-mono text-lg tracking-wider">**** **** **** 4242</p>
                <div className="flex justify-between items-baseline">
                  <div>
                    <p className="text-xs text-gray-300 mb-1">Card Holder</p>
                    <p className="font-medium">Milan Mahat</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-300 mb-1">Expires</p>
                    <p className="font-medium">05/27</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-gray-900">Visa ending in 4242</p>
              <p className="text-sm text-gray-500">Expires 05/2027</p>
            </div>
            <button className="flex items-center text-sm text-navy hover:text-navy/80 font-medium">
              <FiEdit2 className="w-4 h-4 mr-1" />
              Update Card
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Payment Overview</h2>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Available Balance</p>
              <p className="text-2xl font-semibold text-gray-900">$1,240.00</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">This Month</p>
              <p className="text-2xl font-semibold text-gray-900">$3,520.00</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Total Earned</p>
              <p className="text-2xl font-semibold text-gray-900">$12,840.00</p>
            </div>
          </div>
          <button className="bg-navy text-white px-4 py-2 rounded-lg text-sm font-medium">
            Withdraw Funds
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center">
              <p className="text-gray-500">Transaction history will be implemented here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}