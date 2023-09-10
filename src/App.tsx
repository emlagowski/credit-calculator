import * as React from "react"
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  HStack,
  Switch,
  Card,
  CardBody,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Tfoot,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import { Logo } from "./Logo"
import { CheckIcon } from "@chakra-ui/alert/dist/icons"
import { start } from "repl"

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        <VStack spacing={4} justifySelf="flex-start">
          <FormControl>
            <FormLabel>Jaką kwotę kredytu chcesz spłacić?</FormLabel>
            <InputGroup>
              <Input placeholder='Wprowadź kwotę kredytu' type="number"/>
              <InputRightElement
                  pointerEvents='none'
                  color='gray.300'
                  fontSize='1.2em'
                  children='zł'
                />
            </InputGroup>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <HStack>
            <FormControl>
              <FormLabel>Marża banku</FormLabel>
              <InputGroup>
                <Input placeholder='...' type="number"/>
                <InputRightElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1.2em'
                    children='%'
                  />
              </InputGroup>
              {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            </FormControl>
            <FormControl>
              <FormLabel>WIBOR</FormLabel>
              <InputGroup>
                <Input placeholder='...' type="number"/>
                <InputRightElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1.2em'
                    children='%'
                  />
              </InputGroup>
              {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
            </FormControl>
          </HStack>
          <Card>
            <CardBody>
              <Text>Oprocentowanie = 9,2%</Text>
            </CardBody>
          </Card>
          <FormControl>
            <FormLabel>Ile rat pozostało do końca kredytu?</FormLabel>
            <InputGroup>
              <Input placeholder='Wprowadź liczbę rat' type="number"/>
            </InputGroup>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <Card>
            <CardBody>
              <Text>Miesięczna rata = 5532,20 PLN</Text>
            </CardBody>
          </Card>
          <FormControl>
            <FormLabel>Jaką kwotę miesięcznie chcesz płacić?</FormLabel>
            <InputGroup>
              <Input placeholder='Wprowadź łączną kwotę' type="number"/>
              <InputRightElement
                  pointerEvents='none'
                  color='gray.300'
                  fontSize='1.2em'
                  children='zł'
                />
            </InputGroup>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
          </FormControl>
          <Box>
          <TableContainer>
            <Table size='sm'>
              <Thead>
                <Tr>
                  <Th ></Th>
                  <Th>-</Th>
                  <Th>+</Th>
                  <Th>diff</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>Kwota<br/>do spłaty</Td>
                  <Td isNumeric>1000 zł</Td>
                  <Td isNumeric>2000 zł</Td>
                  <Td isNumeric>1000 zł</Td>
                </Tr>
                <Tr>
                  <Td>Koszt<br/>kredytu</Td>
                  <Td isNumeric>1000 zł</Td>
                  <Td isNumeric>2000 zł</Td>
                  <Td isNumeric>1000 zł</Td>
                </Tr>
                <Tr>
                  <Td>Czas<br/>spłaty</Td>
                  <Td>30 lat</Td>
                  <Td>10 lat</Td>
                  <Td>20 lat</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
          </Box>
        </VStack>
      </Grid>
    </Box>
  </ChakraProvider>
)
