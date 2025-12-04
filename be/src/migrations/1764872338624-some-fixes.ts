import {MigrationInterface, QueryRunner} from "typeorm";

export class SomeFixes1764872338624 implements MigrationInterface {
    name = "SomeFixes1764872338624";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "checklists" DROP CONSTRAINT "fk_checklists_todo_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "todos" DROP CONSTRAINT "fk_todos_author_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "refresh_tokens" DROP CONSTRAINT "fk_refresh_tokens_user_id"`,
        );
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_checklists_todo_id"`);
        await queryRunner.query(`DROP INDEX IF EXISTS "public"."idx_todos_author_id"`);
        await queryRunner.query(
            `DROP INDEX IF EXISTS "public"."idx_refresh_tokens_user_id"`,
        );
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "likes_count" integer NOT NULL DEFAULT '0'`,
        );
        await queryRunner.query(`ALTER TABLE "checklists" DROP COLUMN "text"`);
        await queryRunner.query(
            `ALTER TABLE "checklists" ADD "text" text NOT NULL DEFAULT ''`,
        );
        await queryRunner.query(
            `ALTER TABLE "checklists" ALTER COLUMN "todo_id" DROP NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "author_id"`);
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "author_id" character varying NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "priority"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."todo_priority_enum"`);
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "priority" character varying NOT NULL DEFAULT 'medium'`,
        );
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "state"`);
        await queryRunner.query(`DROP TYPE IF EXISTS "public"."todo_state_enum"`);
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "state" character varying NOT NULL DEFAULT 'planning'`,
        );
        await queryRunner.query(
            `ALTER TABLE "refresh_tokens" ALTER COLUMN "created_at" SET NOT NULL`,
        );
        
        // ИСПРАВЛЕНИЕ: Изменить тип колонки вместо удаления/добавления
        await queryRunner.query(
            `ALTER TABLE "refresh_tokens" ALTER COLUMN "token_hash" TYPE character varying USING token_hash::character varying`,
        );
        
        await queryRunner.query(
            `ALTER TABLE "refresh_tokens" ALTER COLUMN "revoked" SET NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "checklists" ADD CONSTRAINT "FK_0b84362a78c887d85b9b5a6403b" FOREIGN KEY ("todo_id") REFERENCES "todos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "checklists" DROP CONSTRAINT "FK_0b84362a78c887d85b9b5a6403b"`,
        );
        await queryRunner.query(
            `ALTER TABLE "refresh_tokens" ALTER COLUMN "revoked" DROP NOT NULL`,
        );
        
        // Вернуть тип обратно в text
        await queryRunner.query(
            `ALTER TABLE "refresh_tokens" ALTER COLUMN "token_hash" TYPE text USING token_hash::text`,
        );
        
        await queryRunner.query(
            `ALTER TABLE "refresh_tokens" ALTER COLUMN "created_at" DROP NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "state"`);
        await queryRunner.query(
            `CREATE TYPE "public"."todo_state_enum" AS ENUM('in_work', 'planning', 'finished', 'canceled')`,
        );
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "state" "public"."todo_state_enum" NOT NULL DEFAULT 'planning'`,
        );
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "priority"`);
        await queryRunner.query(
            `CREATE TYPE "public"."todo_priority_enum" AS ENUM('low', 'medium', 'high', 'super')`,
        );
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "priority" "public"."todo_priority_enum" NOT NULL DEFAULT 'medium'`,
        );
        await queryRunner.query(`ALTER TABLE "todos" DROP COLUMN "author_id"`);
        await queryRunner.query(
            `ALTER TABLE "todos" ADD "author_id" uuid NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "checklists" ALTER COLUMN "todo_id" SET NOT NULL`,
        );
        await queryRunner.query(`ALTER TABLE "checklists" DROP COLUMN "text"`);
        await queryRunner.query(
            `ALTER TABLE "checklists" ADD "text" text array NOT NULL DEFAULT '{}'`,
        );
        await queryRunner.query(
            `ALTER TABLE "todos" DROP COLUMN "likes_count"`,
        );
        await queryRunner.query(
            `CREATE INDEX "idx_refresh_tokens_user_id" ON "refresh_tokens" ("user_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "idx_todos_author_id" ON "todos" ("author_id") `,
        );
        await queryRunner.query(
            `CREATE INDEX "idx_checklists_todo_id" ON "checklists" ("todo_id") `,
        );
        await queryRunner.query(
            `ALTER TABLE "refresh_tokens" ADD CONSTRAINT "fk_refresh_tokens_user_id" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "todos" ADD CONSTRAINT "fk_todos_author_id" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "checklists" ADD CONSTRAINT "fk_checklists_todo_id" FOREIGN KEY ("todo_id") REFERENCES "todos"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
        );
    }
}