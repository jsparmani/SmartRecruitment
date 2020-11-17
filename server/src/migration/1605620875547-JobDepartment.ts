import {MigrationInterface, QueryRunner} from "typeorm";

export class JobDepartment1605620875547 implements MigrationInterface {
    name = 'JobDepartment1605620875547'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "job_department_enum" AS ENUM('accounting', 'hr', 'management', 'marketing', 'product management', 'sales', 'support', 'technical', 'others')`);
        await queryRunner.query(`ALTER TABLE "job" ADD "department" "job_department_enum" NOT NULL DEFAULT 'others'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job" DROP COLUMN "department"`);
        await queryRunner.query(`DROP TYPE "job_department_enum"`);
    }

}
