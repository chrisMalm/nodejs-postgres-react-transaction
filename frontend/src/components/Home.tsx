import { Box, Flex, Heading, Button, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthProvider ";
import { useEffect, useState } from "react";
import { getUserTransactions } from "../api";

interface ITransactions {
    amount: number,
    transaction_date: string;
}
export const Home = () => {
 const [transactions , setTransactions] = useState<ITransactions[]>([])
    const navigate = useNavigate();
    const { logout, user } = useAuth();
    console.log(transactions, "transactiokns");
    

    useEffect(() => {
        const userId = user?.id;
        if (userId) {
          console.log('Fetching transactions for user:', userId);
          getUserTransactions(userId)
            .then((transactions) => {
              console.log('User transactions:', transactions);
                setTransactions(transactions)
            })
            .catch((error) => {
              console.error('Error fetching user transactions:', error);
            });
        }
      }, [user?.id]); // Add user?.id as a dependency

    const handleSignOut = () => {
      console.log("User signed out");
      logout();
      navigate("/login");
    };
    return (
        

      <Flex className="BBB" minH={"100vh"} align={"center"} justify={"center"} direction="row">
        <Box
          borderWidth={1}
          px={4}
          width="md"
          borderRadius={8}
          boxShadow="lg"
          p={8}
        >
          <Box textAlign="center">
            <Heading>Welcome, {user!.name}!</Heading>
          </Box>
          <Box my={4} textAlign="left">
            <p>This is a simple home page for your application.</p>
            <Button
              width="full"
              mt={4}
              colorScheme="teal"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
          </Box>
        </Box>
        {transactions.length > 0 ? (
        <Flex className="CCC"  minH={"100vh"} align={"center"} justify={"center"} direction="column">
            {transactions.map((transaction, index) => (
      <Box key={index} border="1px solid" p={3} m={2}>
        <Text>Amount: {transaction.amount}</Text>
        <Text>Date: {new Date(transaction.transaction_date).toLocaleDateString()}</Text>
      </Box>
    ))}
  </Flex>
) : (
  <Text>No transactions found</Text>
)}
      </Flex>

     
        
    );
  };
