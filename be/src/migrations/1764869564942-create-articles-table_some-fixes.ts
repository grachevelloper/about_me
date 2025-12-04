import {MigrationInterface, QueryRunner} from "typeorm";

export class CreateArticlesTableSomeFixes1764869564942
    implements MigrationInterface
{
    name = "CreateArticlesTableSomeFixes1764869564942";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "tags" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "name" character varying NOT NULL, CONSTRAINT "UQ_d90243459a697eadb8ad56e9092" UNIQUE ("name"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "articles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "title" character varying NOT NULL, "image" character varying NOT NULL, "content" text NOT NULL, "read_time" integer, "likes_count" integer NOT NULL DEFAULT '0', "authorId" uuid, CONSTRAINT "PK_0a6e2c450d83e0b6052c2793334" PRIMARY KEY ("id"))`,
        );
        await queryRunner.query(
            `CREATE TABLE "article_tags" ("articleId" uuid NOT NULL, "tagId" uuid NOT NULL, CONSTRAINT "PK_bfcd6ae5865482ee63ece446586" PRIMARY KEY ("articleId", "tagId"))`,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_acbc7f775fb5e3fe2627477b5f" ON "article_tags" ("articleId") `,
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_83a0534713c9e7f6bb2110c7bc" ON "article_tags" ("tagId") `,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "role" character varying NOT NULL`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "avatar" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "now_reading" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "now_waitch" character varying`,
        );
        await queryRunner.query(
            `ALTER TABLE "users" ADD "now_listening" character varying`,
        );
        await queryRunner.query(`ALTER TABLE "users" ADD "status" integer`);
        await queryRunner.query(
            `ALTER TABLE "articles" ADD CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
        );
        await queryRunner.query(
            `ALTER TABLE "article_tags" ADD CONSTRAINT "FK_acbc7f775fb5e3fe2627477b5f7" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
        await queryRunner.query(
            `ALTER TABLE "article_tags" ADD CONSTRAINT "FK_83a0534713c9e7f6bb2110c7bcc" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "article_tags" DROP CONSTRAINT "FK_83a0534713c9e7f6bb2110c7bcc"`,
        );
        await queryRunner.query(
            `ALTER TABLE "article_tags" DROP CONSTRAINT "FK_acbc7f775fb5e3fe2627477b5f7"`,
        );
        await queryRunner.query(
            `ALTER TABLE "articles" DROP CONSTRAINT "FK_65d9ccc1b02f4d904e90bd76a34"`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "status"`);
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "now_listening"`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "now_waitch"`);
        await queryRunner.query(
            `ALTER TABLE "users" DROP COLUMN "now_reading"`,
        );
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(
            `DROP INDEX "public"."IDX_83a0534713c9e7f6bb2110c7bc"`,
        );
        await queryRunner.query(
            `DROP INDEX "public"."IDX_acbc7f775fb5e3fe2627477b5f"`,
        );
        await queryRunner.query(`DROP TABLE "article_tags"`);
        await queryRunner.query(`DROP TABLE "articles"`);
        await queryRunner.query(`DROP TABLE "tags"`);
    }
}
