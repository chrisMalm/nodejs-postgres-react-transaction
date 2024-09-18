import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react'
import React, { useState } from 'react'

type ErrorKeys = 'amount'

export const Form = () => {
  const [amount, setAmount] = useState<string>('')
  const [errors, setErrors] = useState<{ amount: string }>({ amount: '' })
  const [touched, setTouched] = useState<{ amount: boolean }>({ amount: false })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Form submitted with amount:', amount)
    handleValidation()

    // If there are no errors, process the form
    if (!errors.amount) {
      console.log('Form submitted with amount:', amount)
      setAmount('')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('3')

    setAmount(e.target.value)
  }

  const handleBlur = () => {
    // Mark the field as touched
    setTouched({ amount: true })

    // Validate on blur
    console.log('2')

    handleValidation()
  }
  const handleValidation = () => {
    console.log('1')

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
    console.log('Validation errors:', newErrors) // Debug log
  }

  const isFieldInvalid = (fieldName: ErrorKeys) => {
    console.log('4')

    return !!errors[fieldName]
  }
  const isButtonDisabled = () => {
    console.log('5')

    const shouldDisable = isFieldInvalid('amount') || amount === '0'
    console.log('Button disabled:', shouldDisable) // Debug log
    return shouldDisable
  }

  return (
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
  )
}
