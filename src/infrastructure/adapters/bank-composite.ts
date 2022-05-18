import { IBank } from "../../domain/entities/ibank";
import { IBankBalance } from "../../domain/entities/ibank-balance";
import { IBankTransaction } from "../../domain/entities/ibank-transaction";

export class BankComposite implements IBank {
  constructor(private banks: IBank[]) {}

  async getAccountBalance(accountId: string): Promise<IBankBalance[]> {
    let allBalances = [];
    for (const bank of this.banks) {
      const balance = await bank.getAccountBalance(accountId);
      if (balance) allBalances.push(...balance);
    }

    return allBalances;
  }

  async getTransactions(accountId: string, startDate: Date, endDate: Date): Promise<IBankTransaction[]> {
    let allTransactions = [];
    for (const bank of this.banks) {
      const transactions = await bank.getTransactions(accountId, startDate, endDate);
      if (transactions?.length) allTransactions.push(...transactions);
    }

    return allTransactions;
  }
}
