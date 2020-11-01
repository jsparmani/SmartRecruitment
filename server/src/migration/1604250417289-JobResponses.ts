import {MigrationInterface, QueryRunner} from "typeorm";

export class JobResponses1604250417289 implements MigrationInterface {
    name = 'JobResponses1604250417289'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "response" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "answer" character varying NOT NULL, "jobId" integer, "userId" integer, CONSTRAINT "PK_f64544baf2b4dc48ba623ce768f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "response" ADD CONSTRAINT "FK_a3ed218300154b07545430ba4ed" FOREIGN KEY ("jobId") REFERENCES "job"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "response" ADD CONSTRAINT "FK_a5386ec7299fc4d00b8735ecd42" FOREIGN KEY ("userId") REFERENCES "myusers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "response" DROP CONSTRAINT "FK_a5386ec7299fc4d00b8735ecd42"`);
        await queryRunner.query(`ALTER TABLE "response" DROP CONSTRAINT "FK_a3ed218300154b07545430ba4ed"`);
        await queryRunner.query(`DROP TABLE "response"`);
    }

}
