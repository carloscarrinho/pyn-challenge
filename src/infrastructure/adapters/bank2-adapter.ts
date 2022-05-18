import { Bank2AccountSource } from "../../../bank2/integration/bank2-account-source";
import { IBank } from "../../domain/entities/ibank";
import { IBankBalance } from "../../domain/entities/ibank-balance";
import { IBankTransaction } from "../../domain/entities/ibank-transaction";

export class Bank2Adapter implements IBank {
  constructor(private readonly source: Bank2AccountSource) {}

  async getAccountBalance(accountId: string): Promise<IBankBalance[]> {
    const balanceSource = await this.source.getBalance(parseInt(accountId));

    if (!balanceSource) return [];

    return [
      {
        balance: balanceSource.getBalance(),
        currency: balanceSource.getCurrency(),
      },
    ];
  }

  async getTransactions(accountId: string, startDate: Date, endDate: Date): Promise<IBankTransaction[]> {
    const items = await this.source.getTransactions(parseInt(accountId), startDate, endDate);

    if (!items.length) return [];

    const transactions = items.map((transaction) => {
      return {
        amount: transaction.getAmount(),
        type: transaction.getType(),
        description: transaction.getText(),
      };
    });

    return transactions;
  }
}
