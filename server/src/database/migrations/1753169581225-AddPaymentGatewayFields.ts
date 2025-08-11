import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentGatewayFields1753169581225 implements MigrationInterface {
    name = 'AddPaymentGatewayFields1753169581225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Check if columns exist before adding them
        const table = await queryRunner.getTable('payments');
        
        if (!table?.findColumnByName('gateway')) {
            await queryRunner.query(`ALTER TABLE "payments" ADD "gateway" character varying`);
        }
        
        if (!table?.findColumnByName('gateway_payment_id')) {
            await queryRunner.query(`ALTER TABLE "payments" ADD "gateway_payment_id" character varying`);
        }
        
        if (!table?.findColumnByName('metadata')) {
            await queryRunner.query(`ALTER TABLE "payments" ADD "metadata" json`);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable('payments');
        
        if (table?.findColumnByName('metadata')) {
            await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "metadata"`);
        }
        
        if (table?.findColumnByName('gateway_payment_id')) {
            await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "gateway_payment_id"`);
        }
        
        if (table?.findColumnByName('gateway')) {
            await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "gateway"`);
        }
    }

}
