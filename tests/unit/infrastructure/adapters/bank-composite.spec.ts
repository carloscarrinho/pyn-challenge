import { IBank } from "../../../../src/domain/entities/ibank";
import { BankComposite } from "../../../../src/infrastructure/adapters/bank-composite";
import { accountBalance } from "../../../fixtures/account-balance-fixture";
import { transaction } from "../../../fixtures/transaction-fixture";

const makeBankComposite = ({
  getAccountBalance,
  getTransactions,
}: {
  getAccountBalance?: Function;
  getTransactions?: Function;
}) => {
  const bank = {
    getAccountBalance: getAccountBalance ?? jest.fn().mockResolvedValueOnce([accountBalance]),
    getTransactions: getTransactions ?? jest.fn().mockResolvedValueOnce([transaction]),
  } as unknown as IBank;

  return new BankComposite([bank]);
};

describe("Unit", () => {
  describe("Infrastructure::Adapters", () => {
    describe("BankComposite.getAccountBalances()", () => {
      it("Should call getAccountBalances with accountId", async () => {
        // Given
        const accountId = "7654321";
        const dependencies = { getAccountBalance: jest.fn() };
        const bankComposite = makeBankComposite(dependencies);

        // When
        await bankComposite.getAccountBalance(accountId);

        // Then
        expect(dependencies.getAccountBalance).toHaveBeenCalledWith(accountId);
      });
      
      it("Should return an empty array if the bank account balance is empty", async () => {
        // Given
        const accountId = "7654321";
        const bankComposite = makeBankComposite({ getAccountBalance: jest.fn().mockResolvedValueOnce([]) });

        // When
        const result = await bankComposite.getAccountBalance(accountId);

        // Then
        expect(result).toStrictEqual([]);
      });
      
      it("Should return an array with balances if the bank account has balances", async () => {
        // Given
        const accountId = "7654321";
        const bankComposite = makeBankComposite({});

        // When
        const result = await bankComposite.getAccountBalance(accountId);

        // Then
        expect(result).toStrictEqual([accountBalance]);
      });
    });
    
    describe("BankComposite.getTransactions()", () => {
      it("Should call getTransactions with correct values", async () => {
        // Given
        const accountId = "7654321";
        const startDate = new Date("2022-05-01T00:00:00");
        const endDate = new Date("2022-05-31T00:00:00");
        const dependencies = { getTransactions: jest.fn() };
        const bankComposite = makeBankComposite(dependencies);

        // When
        await bankComposite.getTransactions(accountId, startDate, endDate);

        // Then
        expect(dependencies.getTransactions).toHaveBeenCalledWith(accountId, startDate, endDate);
      });
      
      it("Should return an empty array if the bank does not have transactions", async () => {
        // Given
        const accountId = "7654321";
        const startDate = new Date("2022-05-01T00:00:00");
        const endDate = new Date("2022-05-31T00:00:00");
        const bankComposite = makeBankComposite({ getTransactions: jest.fn().mockResolvedValueOnce([]) });

        // When
        const result = await bankComposite.getTransactions(accountId, startDate, endDate);

        // Then
        expect(result).toStrictEqual([]);
      });
      
      it("Should return an array with transactions if the bank account has transactions", async () => {
        // Given
        const accountId = "7654321";
        const startDate = new Date("2022-05-01T00:00:00");
        const endDate = new Date("2022-05-31T00:00:00");
        const bankComposite = makeBankComposite({});

        // When
        const result = await bankComposite.getTransactions(accountId, startDate, endDate);

        // Then
        expect(result).toStrictEqual([transaction]);
      });
    });
  });
});
