import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

const PORTFOLIO_SOURCE = path.join(__dirname, '..', '..', '..', 'frontend', 'Portflio');
const UPLOADS_DEST = path.join(__dirname, '..', '..', 'uploads');

async function importPortfolio() {
    console.log('🚀 Starting portfolio import...');
    console.log(`Source: ${PORTFOLIO_SOURCE}`);
    console.log(`Destination: ${UPLOADS_DEST}`);

    if (!fs.existsSync(UPLOADS_DEST)) {
        fs.mkdirSync(UPLOADS_DEST, { recursive: true });
    }

    if (!fs.existsSync(PORTFOLIO_SOURCE)) {
        console.error('❌ Source Portflio directory not found!');
        return;
    }

    const folders = fs.readdirSync(PORTFOLIO_SOURCE).filter(f =>
        fs.statSync(path.join(PORTFOLIO_SOURCE, f)).isDirectory()
    );

    for (const folder of folders) {
        console.log(`\n📂 Processing folder: ${folder}`);
        const folderPath = path.join(PORTFOLIO_SOURCE, folder);
        const images = fs.readdirSync(folderPath).filter(img =>
            ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(img).toLowerCase())
        );

        if (images.length === 0) {
            console.log(`⚠️ No images found in ${folder}, skipping.`);
            continue;
        }

        const projectTitle = `Client Project ${folder}`;
        const slug = `client-project-${folder}`;

        // Create or Update Project
        const project = await prisma.project.upsert({
            where: { slug },
            update: {
                title: projectTitle,
                description: `Showcase for ${projectTitle}`,
                category: 'Showcase',
                isActive: true,
                image: `/uploads/p_${folder}_0${path.extname(images[0])}` // Use first image as main
            },
            create: {
                title: projectTitle,
                slug,
                description: `Showcase for ${projectTitle}`,
                category: 'Showcase',
                technologies: '[]',
                isActive: true,
                image: `/uploads/p_${folder}_0${path.extname(images[0])}`
            }
        });

        console.log(`✅ Project ${project.title} (ID: ${project.id}) ready.`);

        // Clear existing images for this project to avoid duplicates if re-running
        await prisma.projectImage.deleteMany({ where: { projectId: project.id } });

        // Copy images and create records
        for (let i = 0; i < images.length; i++) {
            const imgName = images[i];
            const ext = path.extname(imgName);
            const newName = `p_${folder}_${i}${ext}`;
            const targetPath = path.join(UPLOADS_DEST, newName);

            try {
                fs.copyFileSync(path.join(folderPath, imgName), targetPath);

                await prisma.projectImage.create({
                    data: {
                        url: `/uploads/${newName}`,
                        order: i,
                        projectId: project.id,
                        alt: `Project ${folder} Image ${i}`
                    }
                });
                console.log(`   🖼️  Imported image ${i + 1}/${images.length}: ${newName}`);
            } catch (err) {
                console.error(`   ❌ Failed to import ${imgName}:`, err);
            }
        }
    }

    console.log('\n✨ Import completed successfully!');
}

importPortfolio()
    .catch(e => {
        console.error('Import error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
