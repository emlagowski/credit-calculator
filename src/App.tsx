import { useEffect, useState } from "react"
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
  Container,
  Heading,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"
import ExcelFormulas from "./Functions";
import { number } from "yargs";

var Finance = require("tvm-financejs");

const finance = new Finance();

type Record = {
  no: number;
  partOfInterest: number;
  partOfCapital: number;
  overpayment: number;
  remainCreditAmount: number;
}

export const App = () => {
  const [creditAmount, setCreditAmount] = useState(0);
  const [margin, setMargin] = useState(0);
  const [interestRate, setInterestRate] = useState(0);
  const [numberOfInstallments, setNumberOfInstallments] = useState(0);
  const [monthlyAmount, setMonthlyAmount] = useState(0);
  
  const [totalInterestRate, setTotalInterestRate] = useState(0)
  const [baseInstallment, setBaseInstallment] = useState(0)

  const [baseTotal, setBaseTotal] = useState(0)
  const [baseTotalCost, setBaseTotalCost] = useState(0)

  const [matrix, setMatrix] = useState<Record[]>([])
  const [reducedCost, setReducedCost] = useState(0);

  useEffect(() => {
    setTotalInterestRate((margin + interestRate))
  }, [ margin, interestRate])

  useEffect(() => {
    setBaseInstallment(-finance.PMT(totalInterestRate/100/12, numberOfInstallments, creditAmount, 0, 0))
  }, [totalInterestRate, numberOfInstallments, creditAmount])

  useEffect(() => {
    setBaseTotal(baseInstallment * numberOfInstallments)
  }, [ baseInstallment, numberOfInstallments])

  useEffect(() => {
    setBaseTotalCost(baseTotal - creditAmount)
  }, [ baseTotal, creditAmount])

  useEffect(() => {
    var no = 0;
    const records = new Array<Record>();

    var last: Record = {
      no: no,
      partOfInterest: 0,
      partOfCapital: 0,
      overpayment: 0,
      remainCreditAmount: creditAmount
    };
    records.push(last)

    var tmpReducedCost = 0;

    while (last.remainCreditAmount > 0 && no < 1000) {
      no++;
      var ipmt =  Math.round(-finance.IPMT(totalInterestRate/100/12, 1, numberOfInstallments - no, last.remainCreditAmount)*100)/100;
      var ppmt = Math.round(-finance.PPMT(totalInterestRate/100/12, 1, numberOfInstallments - no, last.remainCreditAmount)*100)/100;
      var overpayment = Math.max(0, monthlyAmount - ipmt - ppmt);
      last = {
        no: no,
        partOfInterest: Number.isNaN(ipmt) ? 0 : ipmt,
        partOfCapital: Number.isNaN(ppmt) ? 0 : ppmt,
        overpayment: Number.isNaN(overpayment) ? 0 : overpayment,
        remainCreditAmount: Number.isNaN(last.remainCreditAmount - ppmt - overpayment) ? 0 : (last.remainCreditAmount - ppmt - overpayment)
      }
      console.log(last)
      tmpReducedCost = tmpReducedCost + (Number.isNaN(ipmt) ? 0 : ipmt);
      console.log(tmpReducedCost)
      records.push(last)
    }
    setReducedCost(tmpReducedCost)
    setMatrix(records)
  }, [creditAmount, totalInterestRate, numberOfInstallments, monthlyAmount])

  const formatter = Intl.NumberFormat('en', { notation: 'compact' });

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <VStack spacing={4} justifySelf="flex-start">
            <Heading>Mortgage Slayer</Heading>
            <FormControl>
              <FormLabel>Jaką kwotę kredytu chcesz spłacić?</FormLabel>
              <InputGroup>
                <Input placeholder='Wprowadź kwotę kredytu' /*value={creditAmount}*/type="number" onChange={event => setCreditAmount(Number(event.currentTarget.value))}/>
                <InputRightElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1.2em'
                    children='zł'
                  />
              </InputGroup>
            </FormControl>
            <HStack>
              <FormControl>
                <FormLabel>Marża banku</FormLabel>
                <InputGroup>
                  <Input placeholder='...' /*value={margin}*/ type="number" onChange={event => setMargin(Number(event.currentTarget.value))}/>
                  <InputRightElement
                      pointerEvents='none'
                      color='gray.300'
                      fontSize='1.2em'
                      children='%'
                    />
                </InputGroup>
              </FormControl>
              <FormControl>
                <FormLabel>WIBOR</FormLabel>
                <InputGroup>
                  <Input placeholder='...' /*value={interestRate}*/ type="number" onChange={event => setInterestRate(Number(event.currentTarget.value))}/>
                  <InputRightElement
                      pointerEvents='none'
                      color='gray.300'
                      fontSize='1.2em'
                      children='%'
                    />
                </InputGroup>
              </FormControl>
            </HStack>
            {totalInterestRate > 0 ?
            <Card>
              <CardBody>
                <Text>Oprocentowanie = {totalInterestRate.toFixed(2)}%</Text>
              </CardBody>
            </Card> : <></> }
            <FormControl>
              <FormLabel>Ile rat pozostało do końca kredytu?</FormLabel>
              <InputGroup>
                <Input placeholder='Wprowadź liczbę rat' /*value={numberOfInstallments}*/ type="number" onChange={event => setNumberOfInstallments(Number(event.currentTarget.value))}/>
              </InputGroup>
            </FormControl>
            {baseInstallment > 0 && baseInstallment < Infinity ?
            <Card>
              <CardBody>
                <Text>Miesięczna rata = {baseInstallment.toFixed(2)} PLN</Text>
              </CardBody>
            </Card> : <></> }
            <FormControl>
              <FormLabel>Jaką kwotę miesięcznie chcesz płacić?</FormLabel>
              <InputGroup>
                <Input placeholder='Wprowadź łączną kwotę' /*value={monthlyAmount} */type="number" onChange={event => setMonthlyAmount(Number(event.currentTarget.value))}/>
                <InputRightElement
                    pointerEvents='none'
                    color='gray.300'
                    fontSize='1.2em'
                    children='zł'
                  />
              </InputGroup>
            </FormControl>
            { Number.isNaN(baseTotal) ? <></> :
              <VStack>
              <Text>Wyniki</Text>
              <TableContainer maxWidth="95vw">
                <Table size='sm' overflowX="auto">
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th>Bez<br/>nadpłaty</Th>
                      <Th>Z<br/>nadpłatą</Th>
                      <Th>diff</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    <Tr>
                      <Td>Kwota<br/>do spłaty</Td>
                      <Td isNumeric>{Number.isNaN(baseTotal) ? 0 : formatter.format(baseTotal)} zł</Td>
                      <Td isNumeric>{matrix.length == 0 ? 0 : formatter.format(creditAmount+reducedCost)} zł</Td>
                      <Td isNumeric textColor="green">{matrix.length == 0 ? 0 : formatter.format(baseTotal - (creditAmount+reducedCost))} zł</Td>
                    </Tr>
                    <Tr>
                      <Td>Koszt<br/>kredytu</Td>
                      <Td isNumeric>{Number.isNaN(baseTotalCost) ? 0 :  formatter.format(baseTotalCost)}  zł</Td>
                      <Td isNumeric>{matrix.length == 0 ? 0 : formatter.format(reducedCost)} zł</Td>
                      <Td isNumeric textColor="green">{matrix.length == 0 ? 0 : formatter.format(baseTotalCost - reducedCost)} zł</Td>
                    </Tr>
                    <Tr>
                      <Td>Czas<br/>spłaty</Td>
                      <Td textAlign="end">{Math.round(numberOfInstallments/12)} lat</Td>
                      <Td textAlign="end">{Math.round(matrix.length/12)} lat</Td>
                      <Td textAlign="end">{Math.round(numberOfInstallments/12) - Math.round(matrix.length/12)} lat</Td>
                    </Tr>
                  </Tbody>
                </Table>
              </TableContainer>
              </VStack>
            }
            { matrix.length <= 1 ? <></> : 
              <VStack>
              <Text>Obliczenia Rat</Text>
              <TableContainer maxWidth="95vw">
                <Table size='sm' overflowX="auto">
                  <Thead>
                    <Tr>
                      <Th></Th>
                      <Th>Odsetki</Th>
                      <Th>Kapitał</Th>
                      <Th>Nadpłata</Th>
                      <Th>Zostało</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    { matrix.map(x => (
                      <Tr>
                        <Td>{x.no}</Td>
                        <Td>{x.partOfInterest.toFixed(2)}</Td>
                        <Td>{x.partOfCapital.toFixed(2)}</Td>
                        <Td>{x.overpayment.toFixed(2)}</Td>
                        <Td>{x.remainCreditAmount.toFixed(2)}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              </VStack>
            }
          </VStack>
        </Grid>
      </Box>
    </ChakraProvider>
  )
}
