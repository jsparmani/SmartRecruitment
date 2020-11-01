import {MigrationInterface, QueryRunner} from "typeorm";

export class CompanyLocation1604217093813 implements MigrationInterface {
    name = 'CompanyLocation1604217093813'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" ADD "location" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "company" DROP COLUMN "location"`);
    }

}
