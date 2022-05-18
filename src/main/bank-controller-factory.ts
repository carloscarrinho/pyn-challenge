import { Bank1AccountSource } from "../../bank1/integration/bank1-account-source";
import { Bank2AccountSource } from "../../bank2/integration/bank2-account-source";
import { BankComposite } from "../infrastructure/adapters/bank-composite";
import { Bank1Adapter } from "../infrastructure/adapters/bank1-adapter";
import { Bank2Adapter } from "../infrastructure/adapters/bank2-adapter";
import { BankController } from "../presentation/controllers/bank-controller";

export class BankControllerFactory {
  create(): BankController {
    const bank1Source = new Bank1AccountSource();
    const bank1 = new Bank1Adapter(bank1Source);

    const bank2Source = new Bank2AccountSource();
    const bank2 = new Bank2Adapter(bank2Source);

    const bank = new BankComposite([bank1, bank2]);

    return new BankController(bank);
  }
}
