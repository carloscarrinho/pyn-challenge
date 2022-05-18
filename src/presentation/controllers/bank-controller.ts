import { IBank } from "../../domain/entities/ibank";
import { IBankBalance } from "../../domain/entities/ibank-balance";
import { IBankTransaction } from "../../domain/entities/ibank-transaction";
import { NotFoundError } from "../errors/not-found";
import { SystemError } from "../errors/system-error";

export class BankController {
  constructor(private readonly bank: IBank) {}

  public async getBalances(): Promise<IBankBalance[] | Error> {
    try {
      const account = "7654321"
      const balances = await this.bank.getAccountBalance(account);
      if(!balances.length) return new NotFoundError();      

      return balances;

    } catch (error) {
      return new SystemError(error);
    }
  }

  public async getTransactions(): Promise<IBankTransaction[] | Error> {
    try {
      const transactions = await this.bank.getTransactions(
        "765431",
        new Date("2022-05-01T00:00:00"),
        new Date("2022-05-31T00:00:00"),
      );

      if(!transactions.length) return new NotFoundError();
      
      return transactions;

    } catch (error) {
      return new SystemError(error);
    }
  }

  public async printBalances(): Promise<void> {
    console.log("Getting balances...", await this.getBalances());
  }
  
  public async printTransactions(): Promise<void> {
    console.log("Getting transactions...", await this.getTransactions());
  }
}
