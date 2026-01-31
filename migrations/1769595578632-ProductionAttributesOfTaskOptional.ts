import { MigrationInterface, QueryRunner } from "typeorm";

export class ProductionAttributesOfTaskOptional1769595578632 implements MigrationInterface {
    name = 'ProductionAttributesOfTaskOptional1769595578632'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "materials" DROP COLUMN "barcode"`);
        // await queryRunner.query(`ALTER TABLE "materials" ADD "barcode" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_388081a3e1332355fc4d95fba62"`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "productionQuantity" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "materialId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_388081a3e1332355fc4d95fba62" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "task" DROP CONSTRAINT "FK_388081a3e1332355fc4d95fba62"`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "materialId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ALTER COLUMN "productionQuantity" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "task" ADD CONSTRAINT "FK_388081a3e1332355fc4d95fba62" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        // await queryRunner.query(`ALTER TABLE "materials" DROP COLUMN "barcode"`);
        // await queryRunner.query(`ALTER TABLE "materials" ADD "barcode" text`);
    }

}
