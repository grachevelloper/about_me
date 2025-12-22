import { MigrationInterface, QueryRunner } from "typeorm";

export class NowBeeingInFiled1766126863418 implements MigrationInterface {
    name = 'NowBeeingInFiled1766126863418'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "now_being_in" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "now_being_in"`);
    }

}
