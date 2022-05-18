import { IBankBalance } from "./ibank-balance";
import { IBankTransaction } from "./ibank-transaction";

export interface IBank {
    getAccountBalance(accountId: string): Promise<IBankBalance[]>;
    getTransactions(accountId: string, startDate: Date, endDate: Date): Promise<IBankTransaction[] | null>;
}