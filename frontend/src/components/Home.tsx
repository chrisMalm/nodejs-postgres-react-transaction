import { Box, Flex, Heading, Text } from '@chakra-ui/react'
// import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider '
import { useEffect, useState } from 'react'
import { getUserTransactions } from '../api'
import { Header } from '../components/Header'
import { Form } from './Form'
interface ITransactions {
  amount: number
  transaction_date: string
}
export const Home = () => {
  const [transactions, setTransactions] = useState<ITransactions[]>([])
  // const navigate = useNavigate()
  const { user } = useAuth()

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
  }, [user?.id])

  return (
    <>
      <Header username={user?.name} />
      <Flex className="BBB" minH={'100vh'} direction="row">
        <Box m={'10rem'} w={'50%'}>
          <Heading pb={4} size={'md'} textAlign={'center'}>
            {' '}
            Transactions Form
          </Heading>
          <Form />
        </Box>

        {transactions.length > 0 ? (
          <Box className="CCC" margin={'10rem'} w={'50%'}>
            <Heading pb={4} size={'md'} textAlign={'center'}>
              {' '}
              Transactions History
            </Heading>
            {transactions.map((transaction, index) => (
              <Box key={index} boxShadow="2xl" rounded={'lg'} p={3} m={4}>
                <Heading p={'2'} size={'sm'}>
                  Amount: {transaction.amount}
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
