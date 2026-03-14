const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('--- Current Data ---');
    try {
        const categories = await prisma.serviceCategory.findMany({ include: { services: true } });
        console.log('\nServices:');
        categories.forEach(cat => {
            console.log(`Cat: ${cat.name} (${cat.slug})`);
            cat.services.forEach(serv => {
                console.log(` - ${serv.title} (${serv.slug})`);
            });
        });

        const projects = await prisma.project.findMany();
        console.log('\nProjects:');
        projects.forEach(p => {
            console.log(` - ${p.title} (${p.slug})`);
        });

    } catch (e) {
        console.error('Failed to fetch data:', e);
    } finally {
        await prisma.$disconnect();
    }
}

main();
