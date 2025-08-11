import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePaymentMethodsToStripe1754893353576 implements MigrationInterface {
    name = 'UpdatePaymentMethodsToStripe1754893353576'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // Drop the old gateway columns
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN IF EXISTS "gateway"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN IF EXISTS "gateway_payment_id"`);
        
        // Create new Stripe-specific columns and types
        await queryRunner.query(`CREATE TYPE "public"."payments_bank_transfer_type_enum" AS ENUM('us_bank_account', 'sepa_debit', 'ach_debit', 'ach_credit', 'customer_balance', 'fpx', 'giropay', 'ideal', 'sofort', 'bancontact', 'eps', 'przelewy24')`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "bank_transfer_type" "public"."payments_bank_transfer_type_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "stripe_session_id" character varying`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "stripe_client_secret" character varying`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "bank_details" json`);
        
        await queryRunner.query(`CREATE TYPE "public"."payment_methods_bank_transfer_type_enum" AS ENUM('us_bank_account', 'sepa_debit', 'ach_debit', 'ach_credit', 'customer_balance', 'fpx', 'giropay', 'ideal', 'sofort', 'bancontact', 'eps', 'przelewy24')`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ADD "bank_transfer_type" "public"."payment_methods_bank_transfer_type_enum"`);
        
        // Change default currency to EUR
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'EUR'`);
        
        // Handle foreign key constraints by deleting in proper order
        await queryRunner.query(`DELETE FROM "commissions"`);
        await queryRunner.query(`DELETE FROM "payments"`);
        await queryRunner.query(`DELETE FROM "payment_methods"`);
        
        // Now recreate the enums with only Stripe values
        await queryRunner.query(`ALTER TYPE "public"."payments_payment_method_enum" RENAME TO "payments_payment_method_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_enum" AS ENUM('stripe_bank_transfer')`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum" USING 'stripe_bank_transfer'::"public"."payments_payment_method_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum_old"`);
        
        await queryRunner.query(`ALTER TYPE "public"."payment_methods_type_enum" RENAME TO "payment_methods_type_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."payment_methods_type_enum" AS ENUM('stripe_bank_transfer')`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ALTER COLUMN "type" TYPE "public"."payment_methods_type_enum" USING 'stripe_bank_transfer'::"public"."payment_methods_type_enum"`);
        await queryRunner.query(`DROP TYPE "public"."payment_methods_type_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_methods_type_enum_old" AS ENUM('credit_card', 'debit_card', 'bank_transfer', 'wallet', 'cash')`);
        await queryRunner.query(`ALTER TABLE "payment_methods" ALTER COLUMN "type" TYPE "public"."payment_methods_type_enum_old" USING "type"::"text"::"public"."payment_methods_type_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."payment_methods_type_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payment_methods_type_enum_old" RENAME TO "payment_methods_type_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "currency" SET DEFAULT 'USD'`);
        await queryRunner.query(`CREATE TYPE "public"."payments_payment_method_enum_old" AS ENUM('credit_card', 'debit_card', 'bank_transfer', 'wallet', 'cash')`);
        await queryRunner.query(`ALTER TABLE "payments" ALTER COLUMN "payment_method" TYPE "public"."payments_payment_method_enum_old" USING "payment_method"::"text"::"public"."payments_payment_method_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."payments_payment_method_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."payments_payment_method_enum_old" RENAME TO "payments_payment_method_enum"`);
        await queryRunner.query(`ALTER TABLE "payment_methods" DROP COLUMN "bank_transfer_type"`);
        await queryRunner.query(`DROP TYPE "public"."payment_methods_bank_transfer_type_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "bank_details"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "stripe_client_secret"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "stripe_session_id"`);
        await queryRunner.query(`ALTER TABLE "payments" DROP COLUMN "bank_transfer_type"`);
        await queryRunner.query(`DROP TYPE "public"."payments_bank_transfer_type_enum"`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "gateway_payment_id" character varying`);
        await queryRunner.query(`ALTER TABLE "payments" ADD "gateway" character varying`);
    }

}
