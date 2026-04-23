import { PrismaClient, UserType } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Permission } from '../src/auth/enums/permission.type';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding...');

  const permissionsList = Object.values(Permission);

  const permissions = await Promise.all(
    permissionsList.map((name) =>
      prisma.permission.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );

  const permissionsMap = Object.fromEntries(
    permissions.map((p) => [p.name, p]),
  );

  const userRole = await prisma.role.upsert({
    where: { name: 'user' },
    update: {},
    create: {
      name: 'user',
      rolePermissions: {
        create: [
          {
            permission: {
              connect: { uuid: permissionsMap['users.read'].uuid },
            },
          },
          {
            permission: {
              connect: { uuid: permissionsMap['users.update'].uuid },
            },
          },

          // 🔥 NOVAS PERMISSIONS
          {
            permission: {
              connect: { uuid: permissionsMap['transaction.read'].uuid },
            },
          },
          {
            permission: {
              connect: { uuid: permissionsMap['transaction.create'].uuid },
            },
          },
          {
            permission: {
              connect: { uuid: permissionsMap['transaction.update'].uuid },
            },
          },
          {
            permission: {
              connect: { uuid: permissionsMap['transaction.delete'].uuid },
            },
          },
        ],
      },
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { name: 'admin' },
    update: {},
    create: {
      name: 'admin',
      rolePermissions: {
        create: permissions.map((p) => ({
          permission: {
            connect: { uuid: p.uuid },
          },
        })),
      },
    },
  });

  const password = await bcrypt.hash('12345678', 10);

  // USER
  const user = await prisma.user.upsert({
    where: { email: 'user@email.com' },
    update: {},
    create: {
      email: 'user@email.com',
      password,
      type: UserType.USER,
      userProfile: {
        create: {
          name: 'User Name',
          birthDate: new Date('1990-01-01'),
          avatarUrl: 'https://example.com/user-image.jpg',
        },
      },
      userRoles: {
        create: {
          role: {
            connect: { uuid: userRole.uuid },
          },
        },
      },
    },
  });

  // ADMIN
  const admin = await prisma.user.upsert({
    where: { email: 'admin@email.com' },
    update: {},
    create: {
      email: 'admin@email.com',
      password,
      type: UserType.ADMIN,
      userProfile: {
        create: {
          name: 'Admin Name',
          birthDate: new Date('1985-11-11'),
          avatarUrl: 'https://example.com/admin-image.jpg',
        },
      },
      userRoles: {
        create: {
          role: {
            connect: { uuid: adminRole.uuid },
          },
        },
      },
    },
  });

  await prisma.category.createMany({
    data: [
      {
        name: 'Salário',
        description: 'Renda mensal proveniente do trabalho fixo',
      },
      {
        name: 'Freelance',
        description: 'Renda de trabalhos pontuais ou autônomos',
      },
      {
        name: 'Investimentos',
        description:
          'Ganhos com aplicações financeiras, dividendos ou rendimentos',
      },
      {
        name: 'Aluguel',
        description: 'Pagamento mensal de aluguel de imóvel',
      },
      {
        name: 'Financiamento',
        description: 'Parcelas de financiamento imobiliário',
      },
      {
        name: 'Contas da Casa',
        description: 'Despesas como água, luz, gás e internet',
      },
      {
        name: 'Alimentação',
        description: 'Gastos com supermercado e alimentação em geral',
      },
      {
        name: 'Restaurantes',
        description: 'Gastos com restaurantes, lanchonetes e delivery',
      },
      {
        name: 'Transporte',
        description: 'Gastos com transporte público, combustível e mobilidade',
      },
      {
        name: 'Manutenção Veículo',
        description: 'Custos com manutenção, seguro e documentação de veículos',
      },
      {
        name: 'Saúde',
        description: 'Despesas médicas, exames, consultas e medicamentos',
      },
      {
        name: 'Educação',
        description: 'Cursos, faculdade, livros e materiais de estudo',
      },
      {
        name: 'Lazer',
        description: 'Cinema, viagens, hobbies e entretenimento',
      },
      {
        name: 'Assinaturas',
        description: 'Serviços recorrentes como Netflix, Spotify, etc',
      },
      {
        name: 'Compras',
        description: 'Compras em geral como roupas, eletrônicos e acessórios',
      },
      {
        name: 'Cuidados Pessoais',
        description: 'Gastos com beleza, estética e bem-estar',
      },
      {
        name: 'Presentes',
        description: 'Gastos com presentes e doações',
      },
      {
        name: 'Pets',
        description:
          'Gastos com alimentação, cuidados e brinquedos para animais de estimação',
      },
      {
        name: 'Outros',
        description:
          'Despesas diversas que não se encaixam nas categorias anteriores',
      },
    ],
  });

  console.log('✅ Seed concluída');
  console.log('👤 User:', user.email);
  console.log('👑 Admin:', admin.email);
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
