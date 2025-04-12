import { Inject, Injectable } from '@nestjs/common';
import { Drawer } from 'src/entities';
import { Repository } from 'typeorm';
import { SaveDrawerDto } from './dto/save-drawer.dto';

@Injectable()
export class DrawerRepository {
  constructor(
    @Inject('DRAWER_REPOSITORY')
    private readonly drawerRepository: Repository<Drawer>,
  ) {}
}
