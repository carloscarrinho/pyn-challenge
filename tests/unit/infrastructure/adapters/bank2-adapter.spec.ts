import { Bank2AccountBalance } from "../../../../bank2/integration/bank2-account-balance";
import { Bank2AccountSource } from "../../../../bank2/integration/bank2-account-source";
import { Bank2AccountTransaction } from "../../../../bank2/integration/bank2-account-transaction";
import { Bank2Adapter } from "../../../../src/infrastructure/adapters/bank2-adapter";
import { accountBalance } from "../../../fixtures/account-balance-fixture";
import { transaction } from "../../../fixtures/transaction-fixture";

const balanceSource = new Bank2AccountBalance(100, "USD");
const transactionItem = new Bank2AccountTransaction(100, 1, "any-transaction-description");

const makeBankAdapter = ({
  getBalance,
  getTransactions,
}: {
  getBalance?: Function;
  getTransactions?: Function;
}) => {
  const bankSource = {
    getBalance: getBalance ?? jest.fn().mockResolvedValueOnce(balanceSource),
    getTransactions: getTransactions ?? jest.fn().mockResolvedValueOnce([transactionItem]),
  } as unknown as Bank2AccountSource;

  return new Bank2Adapter(bankSource);
};

describe("Unit", () => {
  describe("Infrastructure::Adapters", () => {
    describe("Bank2Adapter.getAccountBalance()", () => {
      it("Should call getBalance with accountId", async () => {
        // Given
        const accountId = "7654321";
        const dependencies = { getBalance: jest.fn().mockResolvedValueOnce(balanceSource) };

        const bankAdapter = makeBankAdapter(dependencies);

        // When
        await bankAdapter.getAccountBalance(accountId);

        // Then
        expect(dependencies.getBalance).toHaveBeenCalledWith(parseInt(accountId));
      });

      it("Should return an empty array if bank source does not have any balance", async () => {
        // Given
        const accountId = "7654321";
        const bankAdapter = makeBankAdapter({
          getBalance: jest.fn().mockResolvedValueOnce(null),
        });

        // When
        const result = await bankAdapter.getAccountBalance(accountId);

        // Then
        expect(result).toStrictEqual([]);
      });

      it("Should throw an error if bankSource throws", async () => {
        // Given
        const error = new Error();
        error.stack = "any_stack";

        const accountId = "7654321";
        const bankAdapter = makeBankAdapter({
          getBalance: jest.fn().mockImplementationOnce(() => {
            throw error;
          }),
        });

        // When
        const result = bankAdapter.getAccountBalance(accountId);

        // Then
        await expect(result).rejects.toThrow();
      });

      it("Should return an array with balances if the bank account has balances", async () => {
        // Given
        const accountId = "7654321";
        const bankAdapter = makeBankAdapter({});

        // When
        const result = await bankAdapter.getAccountBalance(accountId);

        // Then
        expect(result).toStrictEqual([accountBalance]);
      });
    });

    describe("Bank2Adapter.getTransactions()", () => {
      it("Should call getTransactions with correct values", async () => {
        // Given
        const accountId = "7654321";
        const startDate = new Date("2022-05-01T00:00:00");
        const endDate = new Date("2022-05-31T00:00:00");
        const dependencies = { getTransactions: jest.fn().mockResolvedValueOnce([]) };

        const bankAdapter = makeBankAdapter(dependencies);

        // When
        await bankAdapter.getTransactions(accountId, startDate, endDate);

        // Then
        expect(dependencies.getTransactions).toHaveBeenCalledWith(parseInt(accountId), startDate, endDate);
      });

      it("Should return an empty array if bank source does not have any transaction", async () => {
        // Given
        const accountId = "7654321";
        const startDate = new Date("2022-05-01T00:00:00");
        const endDate = new Date("2022-05-31T00:00:00");
        const bankAdapter = makeBankAdapter({
          getTransactions: jest.fn().mockResolvedValueOnce([]),
        });

        // When
        const result = await bankAdapter.getTransactions(accountId, startDate, endDate);

        // Then
        expect(result).toStrictEqual([]);
      });

      it("Should throw an error if bankSource throws", async () => {
        // Given
        const error = new Error();
        error.stack = "any_stack";

        const accountId = "7654321";
        const startDate = new Date("2022-05-01T00:00:00");
        const endDate = new Date("2022-05-31T00:00:00");
        const bankAdapter = makeBankAdapter({
          getTransactions: jest.fn().mockImplementationOnce(() => {
            throw error;
          }),
        });

        // When
        const result = bankAdapter.getTransactions(accountId, startDate, endDate);

        // Then
        await expect(result).rejects.toThrow();
      });

      it("Should return an array with transactions if the bank account has transactions", async () => {
        // Given
        const accountId = "7654321";
        const startDate = new Date("2022-05-01T00:00:00");
        const endDate = new Date("2022-05-31T00:00:00");
        const bankAdapter = makeBankAdapter({});

        // When
        const result = await bankAdapter.getTransactions(accountId, startDate, endDate);

        // Then
        expect(result).toStrictEqual([transaction]);
      });
    });
  });
});
