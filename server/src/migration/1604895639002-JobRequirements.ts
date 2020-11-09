import {MigrationInterface, QueryRunner} from "typeorm";

export class JobRequirements1604895639002 implements MigrationInterface {
    name = 'JobRequirements1604895639002'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" ADD "requirements" text NOT NULL DEFAULT ''`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "requirements"`);
    }

}
