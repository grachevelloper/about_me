import {MigrationInterface, QueryRunner} from "typeorm";

export class AddUniqueLikeTarget1766810000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "likes"
            ADD CONSTRAINT "UQ_likes_author_entity"
            UNIQUE ("author_id", "entity_type", "entity_id")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "likes"
            DROP CONSTRAINT "UQ_likes_author_entity"
        `);
    }
}
