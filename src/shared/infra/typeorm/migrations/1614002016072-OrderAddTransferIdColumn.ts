import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class OrderAddTransferIdColumn1614002016072
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "mp_id"`);
    queryRunner.query(
      'ALTER TABLE "orders" RENAME "pg_id" to "transaction_id"'
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      'ALTER TABLE "orders" RENAME "transaction_id" to "pg_id"'
    );
    await queryRunner.addColumn(
      'mp_id',
      new TableColumn({
        name: 'mp_id',
        type: 'string',
        isNullable: true
      })
    );
  }
}
