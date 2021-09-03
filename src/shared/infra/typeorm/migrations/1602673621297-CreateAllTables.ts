import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAllTables1602673621297 implements MigrationInterface {
    name = 'CreateAllTables1602673621297'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "coupons" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" text NOT NULL, "expire_date" TIMESTAMP NOT NULL, "amount" integer NOT NULL, "is_percent" boolean NOT NULL, "is_single_use" boolean NOT NULL, "is_active" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d7ea8864a0150183770f3e9a8cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "auth_providers" ("id" text NOT NULL, "type" text NOT NULL, "user_id" uuid NOT NULL, CONSTRAINT "PK_cb277e892a115855fc95c373422" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users_classic_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "password" text NOT NULL, "is_verified" boolean NOT NULL DEFAULT false, CONSTRAINT "REL_f37d393ba3044856a7d9e8d884" UNIQUE ("user_id"), CONSTRAINT "PK_e702e7d7dee90e3f236342d9018" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "role" text NOT NULL DEFAULT 'basic', "email" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "reference_id" character varying NOT NULL, "mp_id" character varying, "pg_id" character varying, "payment_method" character varying NOT NULL, "payment_link" character varying, "project_ids" text NOT NULL, "gross_amount" integer NOT NULL, "discount_amount" integer NOT NULL, "net_amount" integer NOT NULL, "installment_count" integer NOT NULL, "status" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "templates" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "path" text NOT NULL, "status" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "description" text NOT NULL, "category" text NOT NULL, "duration" integer NOT NULL, "ratio" text NOT NULL, "price" integer NOT NULL, CONSTRAINT "PK_515948649ce0bbbe391de702ae5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" text NOT NULL, "path" text NOT NULL, "status" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid NOT NULL, "template_id" uuid NOT NULL, "sections" text NOT NULL, "fields" text NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "auth_providers" ADD CONSTRAINT "FK_262996fd08ab5a69e85b53d0055" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "users_classic_info" ADD CONSTRAINT "FK_f37d393ba3044856a7d9e8d884b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "orders" ADD CONSTRAINT "FK_a922b820eeef29ac1c6800e826a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_bd55b203eb9f92b0c8390380010" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_c5f18df6ef7c9a584336010f253" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_c5f18df6ef7c9a584336010f253"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_bd55b203eb9f92b0c8390380010"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP CONSTRAINT "FK_a922b820eeef29ac1c6800e826a"`);
        await queryRunner.query(`ALTER TABLE "users_classic_info" DROP CONSTRAINT "FK_f37d393ba3044856a7d9e8d884b"`);
        await queryRunner.query(`ALTER TABLE "auth_providers" DROP CONSTRAINT "FK_262996fd08ab5a69e85b53d0055"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "templates"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "users_classic_info"`);
        await queryRunner.query(`DROP TABLE "auth_providers"`);
        await queryRunner.query(`DROP TABLE "coupons"`);
    }

}
