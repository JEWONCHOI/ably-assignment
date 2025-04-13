import { ZzimItem } from 'src/entities/zzim-item.entity';
import { DataSource } from 'typeorm';

export const zzimItemProviders = [
  {
    provide: 'ZZIM_ITEM_PROVIDERS',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ZzimItem),
    inject: ['DATA_SOURCE'],
  },
];
