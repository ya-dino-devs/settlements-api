import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1680000000000 implements MigrationInterface {
  name = 'InitialSchema1680000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" character varying NULL, "email" character varying NOT NULL, "nickname" character varying NULL, "location_id" integer NULL, "password" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "role" character varying NOT NULL DEFAULT 'regular', CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "news_types" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f6789918b4e57e9b458acc9c435" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "news" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "text" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "type_id" integer NOT NULL, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_ca64a8659baffb0f24141d7e25b" FOREIGN KEY ("type_id") REFERENCES "news_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "news" DROP CONSTRAINT "FK_ca64a8659baffb0f24141d7e25b"`,
    );
    await queryRunner.query(`DROP TABLE "news"`);
    await queryRunner.query(`DROP TABLE "news_types"`);
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
