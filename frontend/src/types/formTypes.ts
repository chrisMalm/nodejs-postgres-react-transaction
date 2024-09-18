import { WiredTransaction } from './transactionTypes'

export interface FormProps {
  userId?: string
  setWiredT: (transaction: WiredTransaction) => void
  amount: string
  setAmount: (amount: string) => void
  setConfirmedAmount: (amount: string) => void
  onOpen: () => void
}

export type ErrorKeys = 'amount'
