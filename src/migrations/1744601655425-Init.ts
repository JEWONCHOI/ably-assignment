import { MigrationInterface, QueryRunner } from 'typeorm';

export class Init1744601655425 implements MigrationInterface {
  name = 'Init1744601655425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`drawer\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`thumbnails\` json NOT NULL, \`zzim_count\` int NOT NULL DEFAULT '0', \`user_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_631478953ae8c60451531f66b1\` (\`name\`), INDEX \`IDX_b9974280c192ad5a2e3f7422ea\` (\`user_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`nickname\` varchar(255) NOT NULL, INDEX \`email_index\` (\`email\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`thumbnail\` varchar(255) NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`zzim\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`thumbnail\` varchar(255) NOT NULL, \`user_id\` int NOT NULL, \`product_id\` int NOT NULL, \`drawer_id\` int NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), INDEX \`IDX_3e5a5e3ca7a35e9726380cd453\` (\`user_id\`), INDEX \`IDX_dc66c114e24eb295895b823d88\` (\`product_id\`), INDEX \`IDX_fe71e9d7a379ff8246bcdb3932\` (\`drawer_id\`), INDEX \`user_zzim_product\` (\`user_id\`, \`product_id\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`user_zzim_product\` ON \`zzim\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_fe71e9d7a379ff8246bcdb3932\` ON \`zzim\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_dc66c114e24eb295895b823d88\` ON \`zzim\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3e5a5e3ca7a35e9726380cd453\` ON \`zzim\``,
    );
    await queryRunner.query(`DROP TABLE \`zzim\``);
    await queryRunner.query(`DROP TABLE \`product\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP INDEX \`email_index\` ON \`user\``);
    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(
      `DROP INDEX \`IDX_b9974280c192ad5a2e3f7422ea\` ON \`drawer\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_631478953ae8c60451531f66b1\` ON \`drawer\``,
    );
    await queryRunner.query(`DROP TABLE \`drawer\``);
  }
}
