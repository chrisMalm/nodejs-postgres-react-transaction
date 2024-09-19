import { Box, Flex, Heading } from '@chakra-ui/react'

interface Balance {
  balance: string | ''
}

export const BalanceComponent = ({ balance }: Balance) => {
  return (
    <Flex
      justifyContent={'center'}
      className="WWW"
      color="black"
      width={'full'}
      pt={'5rem'}
    >
      <Box p={10}>
        <Heading size={'md'}>
          Your balance is : {balance !== '' ? balance : ''} kr
        </Heading>
      </Box>
    </Flex>
  )
}
