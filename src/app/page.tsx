'use client'

import { useState } from 'react'
import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { sepolia } from 'viem/chains'
import { abi } from '../../abi'

// Extend Window interface to include ethereum
declare global {
  interface Window {
    ethereum?: any
  }
}

const publicClient = createPublicClient({
  chain: sepolia,
  transport: http(`https://sepolia.infura.io/v3/${process.env.NEXT_PUBLIC_RPC}`),
})

// Contract address on Sepolia
const CONTRACT_ADDRESS = '0x8407Ea3A24f3756A1dC8B6aAaD9Cc4ED4557F30B'

export default function Home() {
  const [account, setAccount] = useState<string>()
  const [message, setMessage] = useState<string>('')
  const [newMessage, setNewMessage] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [txHash, setTxHash] = useState<string>('')

  const connect = async () => {
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        setError('Please install MetaMask or another Web3 wallet')
        return
      }

      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      })

      const [address] = await walletClient.requestAddresses()
      setAccount(address)
      setError('')
    } catch (err) {
      setError('Failed to connect wallet')
      console.error(err)
    }
  }

  const readMessage = async () => {
    try {
      setIsLoading(true)
      setError('')
      const result = await publicClient.readContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: 'getMessage',
      })
      setMessage(result as string)
    } catch (err) {
      setError('Failed to read message')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const writeMessage = async () => {
    if (!account || !newMessage.trim()) return
    
    try {
      if (typeof window === 'undefined' || !window.ethereum) {
        setError('Please install MetaMask or another Web3 wallet')
        return
      }

      setIsLoading(true)
      setError('')
      
      const walletClient = createWalletClient({
        chain: sepolia,
        transport: custom(window.ethereum),
      })
      
      const { request } = await publicClient.simulateContract({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi,
        functionName: 'setMessage',
        args: [newMessage],
        account: account as `0x${string}`,
      })
      
      const hash = await walletClient.writeContract(request)
      setTxHash(hash)
      
      // Wait for transaction confirmation
      const receipt = await publicClient.waitForTransactionReceipt({ hash })
      if (receipt.status === 'success') {
        setTxHash('')
      }
    } catch (err) {
      setError('Failed to write message')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-4xl font-bold text-center mb-8 text-gray-800 dark:text-white">
            String Store Contract
          </h1>
          
          <div className="space-y-6">
            {/* Wallet Connection */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Wallet Connection
              </h2>
              {account ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 dark:text-green-400 font-medium">
                      Connected: {account.slice(0, 6)}...{account.slice(-4)}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Network: Sepolia
                    </p>
                  </div>
                  <button
                    onClick={() => setAccount(undefined)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    Disconnect
                  </button>
                </div>
              ) : (
                <button
                  onClick={connect}
                  className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                >
                  Connect Wallet
                </button>
              )}
            </div>

            {/* Read Message */}
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                Read Message
              </h2>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={readMessage}
                    disabled={isLoading}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Loading...' : 'Read Message'}
                  </button>
                </div>
                {message && (
                  <div className="bg-white dark:bg-gray-600 p-4 rounded-lg border">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">Current message:</p>
                    <p className="text-lg font-mono text-gray-800 dark:text-white break-words">
                      "{message}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Write Message */}
            {account && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
                  Write Message
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      New Message
                    </label>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Enter new message..."
                      className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-600 dark:text-white"
                    />
                  </div>
                  <button
                    onClick={writeMessage}
                    disabled={isLoading || !newMessage.trim()}
                    className="px-6 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 transition-colors"
                  >
                    {isLoading ? 'Writing...' : 'Write Message'}
                  </button>
                </div>
              </div>
            )}

            {/* Transaction Hash */}
            {txHash && (
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">Transaction Hash:</p>
                <p className="font-mono text-sm text-blue-800 dark:text-blue-200 break-all">
                  {txHash}
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <p className="text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}


          </div>
        </div>
      </div>
    </div>
  )
}
