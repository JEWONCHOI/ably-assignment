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
  data: {
    data: [
      {
        id: 414,
        name: '케이스',
        thumbnails: [
          'https://image.com/products/thumbnail/product_3.jpeg',
          'https://image.com/products/thumbnail/product_2.jpeg',
          'https://image.com/products/thumbnail/product_1.jpeg',
          'https://image.com/products/thumbnail/product_0.jpeg',
        ],
        zzim_count: 4,
        user_id: 421,
        created_at: '2025-04-13T14:21:25.775Z',
        updated_at: '2025-04-13T15:59:53.000Z',
      },
    ],
    meta: {
      nextCursor: null,
      hasNext: false,
      size: 10,
    },
  },
};
