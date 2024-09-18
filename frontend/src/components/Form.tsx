import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { wireTransaction } from '../api'
import { WiredTransaction } from './Home'

type ErrorKeys = 'amount'

interface FormProps {
  userId?: string
  setWiredT: (transaction: WiredTransaction) => void
}

export const Form = ({ userId, setWiredT }: FormProps) => {
  const [amount, setAmount] = useState<string>('')
  const [errors, setErrors] = useState<{ amount: string }>({ amount: '' })
  const [touched, setTouched] = useState<{ amount: boolean }>({ amount: false })

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    handleValidation()

    // If there are no errors, process the form
    if (!errors.amount) {
      const wiredTransaction = await wireTransaction(amount, userId)
      const formattedDate = formatDate(wiredTransaction.transaction_date)
      setWiredT({ ...wiredTransaction, transaction_date: formattedDate })
      setAmount('')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value)
  }

  const handleBlur = () => {
    // Mark the field as touched
    setTouched({ amount: true })

    // Validate on blur

    handleValidation()
  }
  const handleValidation = () => {
    let newErrors = { ...errors }
    const numericAmount = Number(amount)

    if (!amount) {
      newErrors.amount = 'Amount is required'
    } else if (isNaN(numericAmount)) {
      newErrors.amount = 'Amount must be a number'
    } else if (numericAmount <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    } else {
      newErrors.amount = ''
    }

    setErrors(newErrors)
  }

  const isFieldInvalid = (fieldName: ErrorKeys) => {
    return !!errors[fieldName]
  }
  const isButtonDisabled = () => {
    const shouldDisable = isFieldInvalid('amount') || amount === '0'
    return shouldDisable
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={isFieldInvalid('amount')} isRequired>
          <FormLabel>Amount</FormLabel>
          <Input
            type="number"
            placeholder="Amount"
            onChange={handleChange}
            value={amount}
            onBlur={handleBlur} // Validate on blur if needed
          />
          {touched.amount && errors.amount && (
            <FormErrorMessage>{errors.amount}</FormErrorMessage>
          )}
        </FormControl>
        <Button
          mt={4}
          colorScheme="teal"
          type="submit"
          isDisabled={isButtonDisabled()}
        >
          Submit
        </Button>
      </form>
    </>
  )
}
