export const CREATE_DRAWER_DATA = {
  id: 3,
  name: '찜박스 생성 Test',
  thumbnails: [],
};

export const GET_MY_DRAWER_ZZIM_LIST_DATA = {
  drawer: {
    id: 414,
    name: '케이스',
  },
  zzims: {
    data: [
      {
        id: 284,
        name: 'product_0',
        price: 140500,
        thumbnail: 'https://image.com/products/thumbnail/product_0.jpeg',
        user_id: 421,
        product_id: 1,
        drawer_id: 414,
        created_at: '2025-04-13T14:22:33.987Z',
        updated_at: '2025-04-13T14:22:33.987Z',
      },
    ],
    meta: {
      nextCursor: null,
      hasNext: false,
      size: 15,
    },
  },
};

export const GET_MY_DRAWER_LIST_DATA = {
  drawerList: [
    {
      id: 31,
      name: '바지',
      thumbnails: [],
      zzim_count: 0,
      created_at: '2025-04-12T13:30:21.660Z',
    },
    {
      id: 30,
      name: '옷',
      thumbnails: [],
      zzim_count: 0,
      created_at: '2025-04-12T13:30:18.667Z',
    },
    {
      id: 29,
      name: '케이스',
      thumbnails: [
        'https://static.xn--wv0b.com/stores/015e4679-e769-4b4c-ac4c-7b38219e4d86/240528112618_1.webp',
        'https://static.xn--wv0b.com/stores/015e4679-e769-4b4c-ac4c-7b38219e4d86/240528112618_2.webp',
        'https://static.xn--wv0b.com/stores/015e4679-e769-4b4c-ac4c-7b38219e4d86/240528112618_20210316180259921.webp',
        'https://static.xn--wv0b.com/stores/015e4679-e769-4b4c-ac4c-7b38219e4d86/240528112618_20210316180300765.webp',
      ],
      zzim_count: 0,
      created_at: '2025-04-12T13:30:11.198Z',
    },
    {
      id: 28,
      name: '1234',
      thumbnails: [],
      zzim_count: 0,
      created_at: '2025-04-12T13:30:03.314Z',
    },
  ],
  totalElement: 4,
  totalPages: 1,
  currentPage: 1,
};
