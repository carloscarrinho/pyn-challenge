import { IBank } from "../../../../src/domain/entities/ibank";
import { BankController } from "../../../../src/presentation/controllers/bank-controller";
import { NotFoundError } from "../../../../src/presentation/errors/not-found";
import { SystemError } from "../../../../src/presentation/errors/system-error";
import { accountBalance } from "../../../fixtures/account-balance-fixture";
import { transaction } from "../../../fixtures/transaction-fixture";

const makeController = ({ 
  getAccountBalance, 
  getTransactions 
}: { 
  getAccountBalance?: Function 
  getTransactions?: Function 
}) => {
  const bank = {
    getAccountBalance: getAccountBalance ?? jest.fn().mockResolvedValue([accountBalance]),
    getTransactions: getTransactions ?? jest.fn().mockResolvedValue([transaction]),
  } as unknown as IBank;

  return new BankController(bank);
};

describe("Unit", () => {
  describe("Presentation::Controllers", () => {
    describe("BankController.getBalances()", () => {
      it("Should call getAccountBalance from bank", async () => {
        // Given
        const dependencies = { getAccountBalance: jest.fn() };
        const controller = makeController(dependencies);

        // When
        await controller.getBalances();

        // Then
        expect(dependencies.getAccountBalance).toHaveBeenCalled();
      });

      it("Should return NotFoundError if getAccountBalance didn't find any balance", async () => {
        // Given
        const dependencies = { getAccountBalance: jest.fn().mockResolvedValueOnce([]) };
        const controller = makeController(dependencies);

        // When
        const result = await controller.getBalances();

        // Then
        expect(result).toStrictEqual(new NotFoundError());
      });

      it("Should return SystemError if getAccountBalance throws an error", async () => {
        // Given
        const error = new Error();
        error.stack = "any-error";
        const dependencies = { getAccountBalance: jest.fn().mockImplementationOnce(() => { throw error }) };
        const controller = makeController(dependencies);

        // When
        const result = await controller.getBalances();

        // Then
        expect(result).toStrictEqual(new SystemError(error.stack));
      });

      it("Should return an array of balances if request is made correctly", async () => {
        // Given
        const controller = makeController({});

        // When
        const result = await controller.getBalances();

        // Then
        expect(result).toStrictEqual([accountBalance]);
      });
    });

    describe("BankController.getTransactions()", () => {
      it("Should call getTransactions from bank", async () => {
        // Given
        const dependencies = { getTransactions: jest.fn() };
        const controller = makeController(dependencies);

        // When
        await controller.getTransactions();

        // Then
        expect(dependencies.getTransactions).toHaveBeenCalled();
      });

      it("Should return NotFoundError if getTransactions didn't find any balance", async () => {
        // Given
        const dependencies = { getTransactions: jest.fn().mockResolvedValueOnce([]) };
        const controller = makeController(dependencies);

        // When
        const result = await controller.getTransactions();

        // Then
        expect(result).toStrictEqual(new NotFoundError());
      });

      it("Should return SystemError if getTransactions throws an error", async () => {
        // Given
        const error = new Error();
        error.stack = "any-error";
        const dependencies = { getTransactions: jest.fn().mockImplementationOnce(() => { throw error }) };
        const controller = makeController(dependencies);

        // When
        const result = await controller.getTransactions();

        // Then
        expect(result).toStrictEqual(new SystemError(error.stack));
      });

      it("Should return an array of transactions if request is made correctly", async () => {
        // Given
        const controller = makeController({});

        // When
        const result = await controller.getTransactions();

        // Then
        expect(result).toStrictEqual([transaction]);
      });
    });
  });
});
