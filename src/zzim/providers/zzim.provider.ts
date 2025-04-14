import { Zzim } from 'src/entities/zzim.entity';
import { DataSource } from 'typeorm';

export const zzimProviders = [
  {
    provide: 'ZZIM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Zzim),
    inject: ['DATA_SOURCE'],
  },
];
