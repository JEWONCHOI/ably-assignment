import { DataSource } from 'typeorm';
import { Drawer } from '../drawer.entity';

export const drawerProviders = [
  {
    provide: 'DRAWER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Drawer),
    inject: ['DATA_SOURCE'],
  },
];
