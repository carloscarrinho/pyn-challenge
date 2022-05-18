import { Bank1AccountSource } from "../../../../bank1/integration/bank1-account-source";
import { Bank1Transaction } from "../../../../bank1/integration/bank1-transaction";
import { Bank1Adapter } from "../../../../src/infrastructure/adapters/bank1-adapter";
import { accountBalance } from "../../../fixtures/account-balance-fixture";
import { transaction } from "../../../fixtures/transaction-fixture";

const transactionItem = new Bank1Transaction(100, 1, "any-transaction-description");

const makeBankAdapter = ({
  getAccountBalance,
  getAccountCurrency,
  getTransactions,
}: {
  getAccountBalance?: Function;
  getAccountCurrency?: Function;
  getTransactions?: Function;
}) => {
  const bankSource = {
    getAccountBalance: getAccountBalance ?? jest.fn().mockResolvedValueOnce(100),
    getAccountCurrency: getAccountCurrency ?? jest.fn().mockResolvedValueOnce("USD"),
    getTransactions: getTransactions ?? jest.fn().mockResolvedValueOnce([transactionItem]),
  } as unknown as Bank1AccountSource;

  return new Bank1Adapter(bankSource);
};

describe("Unit", () => {
  describe("Infrastructure::Adapters", () => {
    describe("Bank1Adapter.getAccountBalance()", () => {
      it("Should call getAccountBalance and getAccountCurrency with accountId", async () => {
        // Given
        const accountId = "7654321";
        const dependencies = {
          getAccountBalance: jest.fn().mockResolvedValueOnce(100),
          getAccountCurrency: jest.fn().mockResolvedValueOnce("USD"),
        };

        const bankAdapter = makeBankAdapter(dependencies);

        // When
        await bankAdapter.getAccountBalance(accountId);

        // Then
        expect(dependencies.getAccountBalance).toHaveBeenCalledWith(parseInt(accountId));
        expect(dependencies.getAccountCurrency).toHaveBeenCalledWith(parseInt(accountId));
      });

      it("Should return an empty array if bank source does not have any balance", async () => {
        // Given
        const accountId = "7654321";
        const bankAdapter = makeBankAdapter({
          getAccountBalance: jest.fn().mockResolvedValueOnce(null),
          getAccountCurrency: jest.fn().mockResolvedValueOnce(null),
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
          getAccountBalance: jest.fn().mockImplementationOnce(() => {
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

    describe("Bank1Adapter.getTransactions()", () => {
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
