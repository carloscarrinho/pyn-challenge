/**
 * Created by Par Renyard on 5/12/21.
 */
export class Bank1Transaction {

    public static TYPE_CREDIT = 1;
    public static TYPE_DEBIT = 2;
    
    constructor(
        private amount: number,
        private type: number,
        private text: string
    ) {}

    public getAmount(): number {
        return this.amount;
    }

    public getType(): number {
        return this.type;
    }

    public getText(): string {
        return this.text;
    }
}
