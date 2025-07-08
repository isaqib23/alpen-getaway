import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentMethodConfig1751961870463 implements MigrationInterface {
    name = 'PaymentMethodConfig1751961870463'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."payment_methods_type_enum" AS ENUM('credit_card', 'debit_card', 'bank_transfer', 'wallet', 'cash')`);
        await queryRunner.query(`CREATE TABLE "payment_methods" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "type" "public"."payment_methods_type_enum" NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "config" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_34f9b8c6dfb4ac3559f7e2820d1" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "payment_methods"`);
        await queryRunner.query(`DROP TYPE "public"."payment_methods_type_enum"`);
    }

}
