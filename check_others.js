const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const partners = await prisma.partner.findMany({ take: 5, select: { logo: true } });
  const invoices = await prisma.invoice.findMany({ take: 5, select: { pdfUrl: true } });
  console.log('Partners:', JSON.stringify(partners, null, 2));
  console.log('Invoices:', JSON.stringify(invoices, null, 2));
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
