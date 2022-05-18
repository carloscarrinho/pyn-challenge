import { BankControllerFactory } from "./main/bank-controller-factory";

const pyyneBank = (new BankControllerFactory()).create();

pyyneBank.printBalances();
pyyneBank.printTransactions();