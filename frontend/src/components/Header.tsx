import { Box, Button, Flex, Heading } from '@chakra-ui/react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthProvider '

interface HeaderProps {
  username?: string // Optional prop since user?.id might be undefined
}

export const Header = ({ username }: HeaderProps) => {
  const navigate = useNavigate()
  const { logout } = useAuth()

  const handleSignOut = () => {
    console.log('User signed out')
    logout()
    navigate('/login')
  }
  return (
    <Flex
      bg="teal.900"
      className="NNN"
      position={'fixed'}
      width={'full'}
      height={'5rem'}
      alignItems={'center'}
    >
      {username && (
        <Box p={'2'}>
          <Heading color={'teal.50'} size={'md'}>
            Welcome, {username}
          </Heading>
        </Box>
      )}
      <Box ml={'auto'} p={'2'}>
        {' '}
        <Button colorScheme="teal" onClick={handleSignOut}>
          Sign Out
        </Button>
      </Box>
    </Flex>
  )
}
