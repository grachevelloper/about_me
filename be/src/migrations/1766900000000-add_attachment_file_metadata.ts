import {MigrationInterface, QueryRunner} from "typeorm";

export class AddAttachmentFileMetadata1766900000000
    implements MigrationInterface
{
    name = "AddAttachmentFileMetadata1766900000000";

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "attachments" ADD "mime_type" character varying NOT NULL DEFAULT 'application/octet-stream'`,
        );
        await queryRunner.query(
            `ALTER TABLE "attachments" ALTER COLUMN "mime_type" DROP DEFAULT`,
        );
        await queryRunner.query(
            `ALTER TABLE "attachments" ADD "size" integer NOT NULL DEFAULT 0`,
        );
        await queryRunner.query(
            `ALTER TABLE "attachments" ALTER COLUMN "size" DROP DEFAULT`,
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attachments" DROP COLUMN "size"`);
        await queryRunner.query(
            `ALTER TABLE "attachments" DROP COLUMN "mime_type"`,
        );
    }
}
