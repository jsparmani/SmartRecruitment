import {MigrationInterface, QueryRunner} from "typeorm";

export class StableV11604216994134 implements MigrationInterface {
    name = 'StableV11604216994134'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "job" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "questions" text NOT NULL DEFAULT '', "companyId" integer, CONSTRAINT "PK_98ab1c14ff8d1cf80d18703b92f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "profile_gender_enum" AS ENUM('male', 'female', 'others')`);
        await queryRunner.query(`CREATE TABLE "profile" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "age" integer NOT NULL, "gender" "profile_gender_enum" NOT NULL, "photo" character varying, "resume" character varying, CONSTRAINT "PK_3dd8bfc97e4a77c70971591bdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "myusers_role_enum" AS ENUM('admin', 'candidate', 'company')`);
        await queryRunner.query(`CREATE TABLE "myusers" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "role" "myusers_role_enum" NOT NULL DEFAULT 'candidate', "password" character varying NOT NULL, "tokenVersion" integer NOT NULL DEFAULT 0, "profileId" integer, CONSTRAINT "UQ_93999fadb433d5e9e0fec615894" UNIQUE ("email"), CONSTRAINT "UQ_9e83a188c982a1cc53750939060" UNIQUE ("username"), CONSTRAINT "REL_2bfbfe4b0d845bbda909618fbe" UNIQUE ("profileId"), CONSTRAINT "PK_adf0fc75117f253f54aa2a4a791" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "company" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "adminId" integer, CONSTRAINT "REL_8a81b99e43da19da787fb9644a" UNIQUE ("adminId"), CONSTRAINT "PK_056f7854a7afdba7cbd6d45fc20" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "job_applied_candidates_myusers" ("jobId" integer NOT NULL, "myusersId" integer NOT NULL, CONSTRAINT "PK_eb1fbeb405bfd13ca1ede6cc182" PRIMARY KEY ("jobId", "myusersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c3d69efc72ee473a863022d5bb" ON "job_applied_candidates_myusers" ("jobId") `);
        await queryRunner.query(`CREATE INDEX "IDX_614d8be0f9e4ed7c84f26f54a2" ON "job_applied_candidates_myusers" ("myusersId") `);
        await queryRunner.query(`ALTER TABLE "job" ADD CONSTRAINT "FK_e66170573cabd565dab1132727d" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "myusers" ADD CONSTRAINT "FK_2bfbfe4b0d845bbda909618fbeb" FOREIGN KEY ("profileId") REFERENCES "profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "company" ADD CONSTRAINT "FK_8a81b99e43da19da787fb9644aa" FOREIGN KEY ("adminId") REFERENCES "myusers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_applied_candidates_myusers" ADD CONSTRAINT "FK_c3d69efc72ee473a863022d5bb0" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "job_applied_candidates_myusers" ADD CONSTRAINT "FK_614d8be0f9e4ed7c84f26f54a2d" FOREIGN KEY ("myusersId") REFERENCES "myusers"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "job_applied_candidates_myusers" DROP CONSTRAINT "FK_614d8be0f9e4ed7c84f26f54a2d"`);
        await queryRunner.query(`ALTER TABLE "job_applied_candidates_myusers" DROP CONSTRAINT "FK_c3d69efc72ee473a863022d5bb0"`);
        await queryRunner.query(`ALTER TABLE "company" DROP CONSTRAINT "FK_8a81b99e43da19da787fb9644aa"`);
        await queryRunner.query(`ALTER TABLE "myusers" DROP CONSTRAINT "FK_2bfbfe4b0d845bbda909618fbeb"`);
        await queryRunner.query(`ALTER TABLE "job" DROP CONSTRAINT "FK_e66170573cabd565dab1132727d"`);
        await queryRunner.query(`DROP INDEX "IDX_614d8be0f9e4ed7c84f26f54a2"`);
        await queryRunner.query(`DROP INDEX "IDX_c3d69efc72ee473a863022d5bb"`);
        await queryRunner.query(`DROP TABLE "job_applied_candidates_myusers"`);
        await queryRunner.query(`DROP TABLE "company"`);
        await queryRunner.query(`DROP TABLE "myusers"`);
        await queryRunner.query(`DROP TYPE "myusers_role_enum"`);
        await queryRunner.query(`DROP TABLE "profile"`);
        await queryRunner.query(`DROP TYPE "profile_gender_enum"`);
        await queryRunner.query(`DROP TABLE "job"`);
    }

}
