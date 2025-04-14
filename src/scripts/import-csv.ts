import csvParser from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { AppDataSource } from 'src/config/orm.config';
import { Product } from 'src/entities';

(async () => {
  const dataSource = await AppDataSource.initialize();
  const productRepository = dataSource.getRepository(Product);
  const results: any[] = [];
  const csvPath = path.join(__dirname, '../../dummy_product.csv');

  fs.createReadStream(csvPath)
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', async () => {
      await productRepository.insert(results);
      console.log('✅ CSV data inserted');
      await dataSource.destroy(); // destroy 호출
    });
})();
