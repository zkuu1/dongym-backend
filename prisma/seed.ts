import { PrismaClient, Prisma } from "../src/generated/prisma/client.js";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const userData: Prisma.usersCreateInput[] = [
  {
    name: "Alice",
    email: "alice@example.com",
    password: "hashedpassword",
    address: "Jakarta",
    role: "user",

    memberships: {
      create: [
        {
          name: "Gold Member",
          description: "Premium membership",
          no_member: "GM001",
          expired_at: new Date("2027-01-01"),
        },
      ],
    },

    absensi: {
      create: [
        {
          date: new Date(),
          status: "Hadir",
        },
      ],
    },

    qr_sessions: {
      create: [
        {
          token: "QR_TOKEN_ALICE",
          expired_at: new Date(Date.now() + 3600 * 1000),
        },
      ],
    },
  },

  {
    name: "Nilu",
    email: "nilu@example.com",
    password: "hashedpassword",
    role: "admin",
  },
];

const categoryData: Prisma.categoriesCreateInput[] = [
  {
    name: "Elektronik",
    description: "Perangkat elektronik",

    products: {
      create: [
        {
          name: "Laptop Gaming",
          description: "Laptop high performance",
          image: "https://image.com/laptop.jpg",
          price: 15000000,
          stock: 5,
        },
        {
          name: "Mouse Wireless",
          price: 250000,
          stock: 20,
        },
      ],
    },
  },

  {
    name: "Aksesoris",
    products: {
      create: [
        {
          name: "Headset",
          price: 500000,
          stock: 10,
        },
      ],
    },
  },
];

const templateData: Prisma.notification_templatesCreateInput[] = [
  {
    message: "Selamat datang!",
  },
  {
    message: "Promo terbaru tersedia!",
  },
];

export async function main() {
  console.log("Seeding users...");
  for (const u of userData) {
    await prisma.users.create({ data: u });
  }

  console.log("Seeding categories & products...");
  for (const c of categoryData) {
    await prisma.categories.create({ data: c });
  }

  console.log("Seeding notification templates...");
  for (const t of templateData) {
    await prisma.notification_templates.create({ data: t });
  }


  const user = await prisma.users.findFirst();
  const product = await prisma.products.findFirst();
  const template = await prisma.notification_templates.findFirst();

  if (user && product) {
    await prisma.likes.create({
      data: {
        id_user: user.id_user,
        id_product: product.id_product,
        status: true,
      },
    });

    await prisma.favourites.create({
      data: {
        id_user: user.id_user,
        id_product: product.id_product,
        status: true,
      },
    });

    await prisma.comments.create({
      data: {
        id_user: user.id_user,
        id_product: product.id_product,
        comment_text: "Produk bagus!",
      },
    });
  }

  if (user && template) {
    await prisma.notification_logs.create({
      data: {
        id_user: user.id_user,
        id_template: template.id_template,
      },
    });
  }

  console.log("Seeding selesai ");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });