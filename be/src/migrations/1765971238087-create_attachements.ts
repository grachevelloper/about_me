import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateAttachements1765971238087 implements MigrationInterface {
    name = "CreateAttachements1765971238087";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."entity_image_type" AS ENUM('user', 'article', 'todo')`,
        );
        await queryRunner.query(
            `CREATE TABLE "attachments" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "url" character varying NOT NULL, "s3_key" character varying NOT NULL, "entity_type" "public"."entity_image_type" NOT NULL, "entity_id" uuid NOT NULL, CONSTRAINT "PK_5e1f050bcff31e3084a1d662412" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_attachments_entity" ON "attachments" ("entity_type", "entity_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(
            `CREATE TYPE "public"."user_role" AS ENUM('Admin', 'Writer', 'User')`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "role" "public"."user_role" NOT NULL DEFAULT 'User'`,
        );
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
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."user_role"`);
        await queryRunner.query(
            `ALTER TABLE "users" ADD "role" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`,
        );
        await queryRunner.query(`DROP INDEX "public"."IDX_attachments_entity"`);
        await queryRunner.query(`DROP TABLE "attachments"`);
        await queryRunner.query(`DROP TYPE "public"."entity_image_type"`);
    }
}
