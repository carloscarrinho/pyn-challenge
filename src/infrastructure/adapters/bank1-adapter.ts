import { Bank1AccountSource } from "../../../bank1/integration/bank1-account-source";
import { IBank } from "../../domain/entities/ibank";
import { IBankBalance } from "../../domain/entities/ibank-balance";
import { IBankTransaction } from "../../domain/entities/ibank-transaction";

export class Bank1Adapter implements IBank {
  constructor(private readonly source: Bank1AccountSource) {}

  async getAccountBalance(accountId: string): Promise<IBankBalance[]> {
    const balance = await this.source.getAccountBalance(parseInt(accountId));
    const currency = await this.source.getAccountCurrency(parseInt(accountId));

    if (!balance && !currency) return [];

    return [{ balance, currency }];
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
