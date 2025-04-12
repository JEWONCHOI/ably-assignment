import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1744464563893 implements MigrationInterface {
    name = 'Init1744464563893'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`drawer\` ADD \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`drawer\` ADD \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`CREATE INDEX \`IDX_631478953ae8c60451531f66b1\` ON \`drawer\` (\`name\`)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_631478953ae8c60451531f66b1\` ON \`drawer\``);
        await queryRunner.query(`ALTER TABLE \`drawer\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`drawer\` DROP COLUMN \`created_at\``);
    }

}
