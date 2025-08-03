import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPaymentGatewayFields1753169581225 implements MigrationInterface {
    name = 'AddPaymentGatewayFields1753169581225'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" ADD "gateway" character varying`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "gateway_payment_id" character varying`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "metadata" json`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "metadata"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "gateway_payment_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "gateway"`);
    }

}
