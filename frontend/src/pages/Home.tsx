import {
  Box,
  Flex,
  Heading,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { useAuth } from '../contexts/AuthProvider '
import { useEffect, useState } from 'react'
import { getBalance, getUserTransactions } from '../api'
import { Header } from '../components/HeaderComponent'
import { Form } from '../components/FormComponent'
import { WiredTransaction, ITransactions } from '../types/transactionTypes'
import { BalanceComponent } from '../components/BalanceComponent'

export const Home = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [confirmedAmount, setConfirmedAmount] = useState<string | null>(null) // This will hold the submitted amount
  const [bankBalance, setBankBalance] = useState<string | ''>('')
  const [amount, setAmount] = useState<string>('')
  const [transactions, setTransactions] = useState<ITransactions[]>([])
  const [wiredT, setWiredT] = useState<WiredTransaction>({
    balance: null,
    transaction_date: '',
  })
  const { user } = useAuth()

  useEffect(() => {
    const userId = user?.id
    if (userId) {
      getBalance(userId)
        .then((bank) => {
          setBankBalance(bank.balance)
        })
        .catch((error) => {
          console.error('Error fetching bank balance:', error)
        })
    }
  }, [user?.id, confirmedAmount])

  useEffect(() => {
    const userId = user?.id
    if (userId) {
      getUserTransactions(userId)
        .then((transactions) => {
          setTransactions(transactions)
        })
        .catch((error) => {
          console.error('Error fetching user transactions:', error)
        })
    }
  }, [user?.id, confirmedAmount])

  return (
    <>
      <Header username={user?.name} />
      <BalanceComponent balance={bankBalance} />
      <Flex className="BBB" minH={'100vh'} direction="row">
        <Box my={'10rem'} mx={'5rem'} w={'50%'}>
          <Heading pb={4} size={'md'} textAlign={'center'}>
            {' '}
            Transactions Form
          </Heading>
          <Form
            userId={user?.id}
            setWiredT={setWiredT}
            amount={amount}
            setAmount={setAmount}
            onOpen={onOpen}
            setConfirmedAmount={setConfirmedAmount}
          />
          {isOpen && (
            // tooltip o töm balance o amount ist för Box shadow
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Transactions</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Box p={4}>
                    <Heading size={'md'} pb={4}>
                      {`Successfully ${
                        parseFloat(confirmedAmount || '0') < 0
                          ? 'Withdrawal'
                          : 'Deposit'
                      } of ${confirmedAmount}kr
             `}
                    </Heading>
                    <Heading pb={4} size={'sm'} color={'teal'}>
                      Current Balance: {wiredT.balance} kr
                    </Heading>
                    <Heading size={'sm'} color={'teal'}>
                      Wired Date: {wiredT.transaction_date}
                    </Heading>
                  </Box>
                </ModalBody>
              </ModalContent>
            </Modal>
          )}
        </Box>

        {transactions.length > 0 ? (
          <Box className="CCC" my={'10rem'} mx={'5rem'} w={'50%'}>
            <Heading pb={4} size={'md'} textAlign={'center'}>
              {' '}
              Transactions History
            </Heading>
            {transactions.map((transaction, index) => (
              <Box
                key={index}
                boxShadow="2xl"
                rounded={'lg'}
                p={3}
                m={4}
                bg={index === 0 ? 'teal.100' : 'white'}
              >
                {index === 0 && <Heading size={'md'}>Last transaction</Heading>}
                <Heading p={'2'} size={'sm'}>
                  Amount{' '}
                  {transaction.amount < 0
                    ? `Withdrawal ${transaction.amount}`
                    : `Deposit ${transaction.amount}`}{' '}
                  kr
                </Heading>
                <Heading p={'2'} size={'xs'}>
                  Date:{' '}
                  {new Date(transaction.transaction_date).toLocaleDateString()}
                </Heading>
              </Box>
            ))}
          </Box>
        ) : (
          <Text>No transactions found</Text>
        )}
      </Flex>
    </>
  )
}
