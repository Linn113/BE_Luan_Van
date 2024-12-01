import { OrderStatus } from 'src/order/entities/orderstatus.entity';
import { Payment } from 'src/order/entities/payment.entity';
import { Category } from 'src/product/entities/category.entity';
import { User } from 'src/user/entities/user.entity';

export const categories: Category[] = [
  {
    id: '1',
    name: 'comCuonComXuat',
    description: 'Menu Cố Định',
  },
  {
    id: '2',
    name: 'comXuat',
    description: 'Cơm Xuất',
  },
  {
    id: '3',
    name: 'salad',
    description: 'Salad',
  },
  {
    id: '4',
    name: 'DoAn',
    description: 'Đồ Ăn Healthy',
  },
  {
    id: '5',
    name: 'doUong',
    description: 'Đồ Uống Healthy',
  },
  {
    id: '6',
    name: 'goiVoLong',
    description: 'Gói Vỡ Lòng',
  },
  {
    id: '7',
    name: 'goiThucChien',
    description: 'Gói thực Chiến 1:1',
  },
];

export const payments: Payment[] = [
  {
    id: '1',
    name: 'NH',
    description: 'Thanh Toán khi nhận hàng',
    order: null,
  },
  {
    id: '2',
    name: 'TT',
    description: 'Thanh Toán Online',
    order: null,
  },
];

export const orders: OrderStatus[] = [
  {
    id: '1',
    order: null,
    status: 'Đang xử lý',
  },
  {
    id: '2',
    order: null,
    status: 'Thành công',
  },
  {
    id: '3',
    order: null,
    status: 'Hủy Đơn',
  },
  {
    id: '4',
    order: null,
    status: 'Đang Giao',
  },
];

export const products: any[] = [
  {
    id: '1',
    category: 3,
    calories: 300, // Assuming 300 calories for Salad
    description:
      'Salad rong nho thập cẩm không chỉ là một món ăn bổ dưỡng mà còn là sự kết hợp hoàn hảo của các thành phần tươi ngon, bao gồm 100g rong nho, 100g đậu, 50g bơ và các gia vị ăn kiêng giúp bạn thưởng thức một bữa ăn cân bằng và đầy đủ chất dinh dưỡng.',
    name: 'Salad',
    images: JSON.stringify([
      {
        url: 'https://i.pinimg.com/564x/78/c4/33/78c433eb22a7fb53e31df6150ca867b2.jpg',
      },
      {
        url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      },
      {
        url: 'https://img.freepik.com/free-photo/vegan-food-white-plates-with-wooden-background_23-2148305807.jpg',
      },
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvpJMsARtiV2bOIqjP0CX4SzA8CMe0XVZxb2EyTz9_ky-gS0q4Aa7_l885f-CLk0nI1CE&usqp=CAU',
      },
    ]),
    price: 700000,
    status: 'Còn Hàng',
  },
  {
    id: '2',
    category: 3,
    calories: 400, // Assuming 400 calories for DoAn Healthy
    description:
      'DoAn Healthy là một món ăn được chế biến từ các nguyên liệu tươi ngon, giàu dinh dưỡng, bao gồm 100g thịt, 100g rau, 50g gạo và các gia vị ăn kiêng giúp bạn thưởng thức một bữa ăn cân bằng và đầy đủ chất dinh dưỡng.',
    name: 'DoAn Healthy',
    images: JSON.stringify([
      {
        url: 'https://i.pinimg.com/564x/78/c4/33/78c433eb22a7fb53e31df6150ca867b2.jpg',
      },
      {
        url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      },
      {
        url: 'https://img.freepik.com/free-photo/vegan-food-white-plates-with-wooden-background_23-2148305807.jpg',
      },
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvpJMsARtiV2bOIqjP0CX4SzA8CMe0XVZxb2EyTz9_ky-gS0q4Aa7_l885f-CLk0nI1CE&usqp=CAU',
      },
    ]),
    price: 80000,
    status: 'Còn Hàng',
  },
  {
    id: '3',
    category: 2,
    calories: 200, // Assuming 200 calories for DoUong Healthy
    description:
      'DoUong Healthy là một loại đồ uống được chế biến từ các nguyên liệu tươi ngon, giàu dinh dưỡng, bao gồm 100g hoa quả, 100g sữa, 50g đường và các gia vị ăn kiêng giúp bạn thưởng thức một bữa ăn cân bằng và đầy đủ chất dinh dưỡng.',
    name: 'DoUong Healthy',
    images: JSON.stringify([
      {
        url: 'https://i.pinimg.com/564x/78/c4/33/78c433eb22a7fb53e31df6150ca867b2.jpg',
      },
      {
        url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      },
      {
        url: 'https://img.freepik.com/free-photo/vegan-food-white-plates-with-wooden-background_23-2148305807.jpg',
      },
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvpJMsARtiV2bOIqjP0CX4SzA8CMe0XVZxb2EyTz9_ky-gS0q4Aa7_l885f-CLk0nI1CE&usqp=CAU',
      },
    ]),
    price: 90000,
    status: 'Còn Hàng',
  },
  {
    id: '4',
    category: 1,
    calories: 500, // Assuming 500 calories for Gói Vỡ Lòng
    description:
      'GoiVoLong là một món ăn được chế biến từ các nguyên liệu tươi ngon, giàu dinh dưỡng, bao gồm 100g thịt, 100g rau, 50g gạo và các gia vị ăn kiêng giúp bạn thưởng thức một bữa ăn cân bằng và đầy đủ chất dinh dưỡng.',
    name: 'GoiVoLong',
    images: JSON.stringify([
      {
        url: 'https://i.pinimg.com/564x/78/c4/33/78c433eb22a7fb53e31df6150ca867b2.jpg',
      },
      {
        url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      },
      {
        url: 'https://img.freepik.com/free-photo/vegan-food-white-plates-with-wooden-background_23-2148305807.jpg',
      },
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvpJMsARtiV2bOIqjP0CX4SzA8CMe0XVZxb2EyTz9_ky-gS0q4Aa7_l885f-CLk0nI1CE&usqp=CAU',
      },
    ]),
    price: 100000,
    status: 'Còn Hàng',
  },
  {
    id: '5',
    category: 7,
    calories: 600, // Assuming 600 calories for Gói Thức Chiến
    description:
      'GoiThucChien là một món ăn được chế biến từ các nguyên liệu tươi ngon, giàu dinh dưỡng, bao gồm 100g thịt, 100g rau, 50g gạo và các gia vị ăn kiêng giúp bạn thưởng thức một bữa ăn cân bằng và đầy đủ chất dinh dưỡng.',
    name: 'GoiThucChien',
    images: JSON.stringify([
      {
        url: 'https://i.pinimg.com/564x/78/c4/33/78c433eb22a7fb53e31df6150ca867b2.jpg',
      },
      {
        url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg',
      },
      {
        url: 'https://img.freepik.com/free-photo/vegan-food-white-plates-with-wooden-background_23-2148305807.jpg',
      },
      {
        url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRvpJMsARtiV2bOIqjP0CX4SzA8CMe0XVZxb2EyTz9_ky-gS0q4Aa7_l885f-CLk0nI1CE&usqp=CAU',
      },
    ]),
    price: 110000,
    status: 'Còn Hàng',
  },
];

export const userAdmin: Omit<User, 'createdAt'> = {
  id: '1',
  addresses: null,
  email: 'admin@gmail.com',
  password: '$2b$10$wWuNIlCHOjSHXDEyDxKMhux1B8Eq3okEkVBcxYXl2EBTWn.zDWsaO',
  firstName: 'admin',
  isAdmin: true,
  lastName: 'admin',
  orders: null,
  phone: '',
};
