import { Prisma } from "@prisma/client";

export const userSelect = {
  id: true,
  username: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type UserData = Prisma.UserGetPayload<{
  select: typeof userSelect;
}>;

export const contentSelect= {
  id: true,
  title: true,
  description: true,
  createdAt: true,
  updatedAt: true,
};

export type ContentData = Prisma.ContentGetPayload<{
  select: typeof contentSelect;
}>;

export const productSelect = {
  id: true,
  name: true,
  description: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  Variant: {
    select: {
      id: true,
      name: true,
      price: true,
      stock: true,
      images: true,
    },
  },
  categories: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.ProductSelect;

export type ProductData = Prisma.ProductGetPayload<{
  select: typeof productSelect;
}>;

export const VariantSelect = {
  id: true,
  name: true,
  price: true,
  stock: true,
  images: true,
  productId: true,
} satisfies Prisma.VariantSelect;

export type VariantData = Prisma.VariantGetPayload<{
  select: typeof VariantSelect;
}>;

export const categorySelect = {
  id: true,
  name: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.CategorySelect;

export type CategoryData = Prisma.CategoryGetPayload<{
  select: typeof categorySelect;
}>;

// export const messageDataSelect = {
//   id: true,
//   content: true,
//   serverId: true,
//   timestamp: true,
//   edited: true,
//   user: {
//     select: {
//       id: true,
//       username: true,
//       displayName: true,
//     },
//   },
// } satisfies Prisma.MessageSelect;

// export type MessageData = Prisma.MessageGetPayload<{
//   select: typeof messageDataSelect;
// }>;

// export const memberDataSelect = {
//   id: true,
//   role: true,
//   status: true,
//   joinedAt: true,
//   invitedAt: true,
//   user: {
//     select: {
//       id: true,
//       username: true,
//       displayName: true,
//       discriminator: true,
//     }
//   },
//   server:{
//     select:{
//       id:true,
//       name:true,
//     }
//   }
// } satisfies Prisma.ServerMemberSelect;

// export type MemberData = Prisma.ServerMemberGetPayload<{
//   select: typeof memberDataSelect;
// }>;

// export const friendDataSelect = {
//   id: true,
//   status: true,
//   userId: true,
//   friendId: true,
//   user: {
//     select: {
//       id: true,
//       username: true,
//       displayName: true,
//       discriminator: true,
//     },
//   },
//   friend: {
//     select: {
//       id: true,
//       username: true,
//       displayName: true,
//       discriminator: true,
//     },
//   },
// };

// export type friendData = Prisma.FriendGetPayload<{
//   select: typeof friendDataSelect;
// }>;

// export const formatedFriendDataSelect = {
//   id: true,
//   status: true,
//   userId: true,
//   friendId: true,
//   user: {
//     select: {
//       id: true,
//       username: true,
//       displayName: true,
//       discriminator: true,
//     },
//   },

// };

// export type formatedFriendData = Prisma.FriendGetPayload<{
//   select: typeof formatedFriendDataSelect;
// }>;
