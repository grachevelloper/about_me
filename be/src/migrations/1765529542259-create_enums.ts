import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateEnums1765529542259 implements MigrationInterface {
    name = "CreateEnums1765529542259";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "priority"`);
        await queryRunner.query(
            `CREATE TYPE "public"."todo_priority" AS ENUM('Hight', 'Medium', 'Low', 'Super')`,
        );
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "priority" "public"."todo_priority" NOT NULL DEFAULT 'Medium'`,
        );
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "state"`);
        await queryRunner.query(
            `CREATE TYPE "public"."todo_state" AS ENUM('Planning', 'In_work', 'Finished', 'Canceled')`,
        );
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "state" "public"."todo_state" NOT NULL DEFAULT 'Planning'`,
        );
        await queryRunner.query(
            `ALTER TABLE "likes" DROP COLUMN "entity_type"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."entity_liked_type" AS ENUM('comment', 'todo', 'article')`,
        );
        await queryRunner.query(
            `ALTER TABLE "likes" ADD "entity_type" "public"."entity_liked_type" NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" DROP COLUMN "entity_type"`,
        );
        await queryRunner.query(
            `CREATE TYPE "public"."entity_commented_type" AS ENUM('todo', 'article')`,
        );
        await queryRunner.query(
            `ALTER TABLE "comments" ADD "entity_type" "public"."entity_commented_type" NOT NULL`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "comments" DROP COLUMN "entity_type"`,
        );
        await queryRunner.query(`DROP TYPE "public"."entity_commented_type"`);
        await queryRunner.query(
            `ALTER TABLE "comments" ADD "entity_type" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "likes" DROP COLUMN "entity_type"`,
        );
        await queryRunner.query(`DROP TYPE "public"."entity_liked_type"`);
        await queryRunner.query(
            `ALTER TABLE "likes" ADD "entity_type" character varying NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TYPE "public"."todo_state"`);
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "state" character varying NOT NULL DEFAULT 'planning'`,
        );
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "priority"`);
        await queryRunner.query(`DROP TYPE "public"."todo_priority"`);
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "priority" character varying NOT NULL DEFAULT 'medium'`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "role" character varying NOT NULL`,
        );
    }
}
