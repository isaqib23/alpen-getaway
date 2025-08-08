import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCarImagesTable1753107411599 implements MigrationInterface {
    name = 'UpdateCarImagesTable1753107411599'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."car_images_status_enum" AS ENUM('pending', 'approved', 'rejected')`);
        await queryRunner.query(`ALTER TABLE "car_images" ADD "status" "public"."car_images_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "car_images" ADD "file_size" integer`);
        await queryRunner.query(`ALTER TABLE "car_images" ADD "file_name" character varying`);
        await queryRunner.query(`ALTER TABLE "car_images" ADD "mime_type" character varying`);
        await queryRunner.query(`ALTER TABLE "car_images" ADD "width" integer`);
        await queryRunner.query(`ALTER TABLE "car_images" ADD "height" integer`);
        await queryRunner.query(`ALTER TABLE "car_images" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "car_images" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "car_images" DROP COLUMN "height"`);
        await queryRunner.query(`ALTER TABLE "car_images" DROP COLUMN "width"`);
        await queryRunner.query(`ALTER TABLE "car_images" DROP COLUMN "mime_type"`);
        await queryRunner.query(`ALTER TABLE "car_images" DROP COLUMN "file_name"`);
        await queryRunner.query(`ALTER TABLE "car_images" DROP COLUMN "file_size"`);
        await queryRunner.query(`ALTER TABLE "car_images" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."car_images_status_enum"`);
    }

}
