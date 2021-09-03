import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddOrderPaymentLink1605804614555 implements MigrationInterface {
  name = 'AddOrderPaymentLink1605804614555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "payment_link"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "boleto" text DEFAULT null`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "boleto"`);
    await queryRunner.query(
      `ALTER TABLE "orders" ADD "payment_link" character varying`
    );
  }
}
