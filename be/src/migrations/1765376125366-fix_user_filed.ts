import {MigrationInterface, QueryRunner} from "typeorm";

export class FixUserFiled1765376125366 implements MigrationInterface {
    name = "FixUserFiled1765376125366";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" RENAME COLUMN "now_waitch" TO "now_watch"`,
        );
        await queryRunner.query(
            `ALTER TABLE "articles" ADD "is_draft" boolean NOT NULL DEFAULT true`,
        );
        await queryRunner.query(
            `ALTER TABLE "checklists" ALTER COLUMN "text" DROP DEFAULT`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "checklists" ALTER COLUMN "text" SET DEFAULT ''`,
        );
        await queryRunner.query(
            `ALTER TABLE "articles" DROP COLUMN "is_draft"`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" RENAME COLUMN "now_watch" TO "now_waitch"`,
        );
    }
}
