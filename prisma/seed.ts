import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting JOVERO comprehensive seed...');

    // 1. Admin User
    const adminEmail = 'admin@jovero.com';
    const password = await bcrypt.hash('admin123', 10);

    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            password,
            name: 'JOVERO Admin',
            role: 'ADMIN',
        },
    });
    console.log('👤 Admin user verified');

    // 2. Site Settings
    const settings = [
        { key: 'companyName', value: 'JOVERO' },
        { key: 'email', value: 'info@jovero.com' },
        { key: 'phone', value: '+962 7 0000 0000' },
        { key: 'address', value: 'Amman, Jordan' },
        { key: 'license', value: 'JOVERO-2026-HQ' },
        { key: 'whatsappNumber', value: '+962700000000' },
        { key: 'linkedin', value: 'https://linkedin.com/company/jovero' },
        { key: 'instagram', value: 'https://instagram.com/jovero' },
    ];

    for (const s of settings) {
        await prisma.siteSetting.upsert({
            where: { key: s.key },
            update: { value: s.value },
            create: s,
        });
    }
    console.log('⚙️ Site settings seeded');

    // 3. Page Sections (Home & About)
    const pageSections = [
        // --- HOME ---
        {
            page: 'home',
            section: 'hero',
            content: JSON.stringify({
                badgeText: "Leading Healthcare Marketing Agency",
                titleLine1: "JOVERO:",
                titleLine2: "Digital Growth for Medical Professionals",
                description: "We architect enterprise-grade marketing and software solutions tailored for the medical field. From patient acquisition systems to high-performance healthcare platforms, we turn your practice into a digital leader.",
                primaryBtnText: "Start Your Growth",
                secondaryBtnText: "View Our Portfolio"
            })
        },
        {
            page: 'home',
            section: 'features',
            content: JSON.stringify({
                badge: "Core Values",
                title: "Built on Precision & Strategic Excellence",
                description: "We combine engineering discipline with global rapid innovation to deliver digital solutions that redefine industry standards in healthcare marketing and performance.",
                btnText: "Our Strategic Approach"
            })
        },
        {
            page: 'home',
            section: 'stats',
            content: JSON.stringify({
                stats: [
                    { label: "Successful Campaigns", value: "200", suffix: "+" },
                    { label: "Medical Partners", value: "120", suffix: "+" },
                    { label: "Years of Experience", value: "6", suffix: "+" },
                    { label: "Patient Growth", value: "100", suffix: "%" },
                ]
            })
        },
        {
            page: 'home',
            section: 'cta',
            content: JSON.stringify({
                badge: "Initiation",
                title: "Accelerate Your Practice",
                description: "Our team of marketing experts is ready to architect your digital future. Let's turn your vision into a strategic marketing asset that drives patient engagement and growth."
            })
        },
        // --- ABOUT ---
        {
            page: 'about',
            section: 'values',
            content: JSON.stringify([
                { title: 'Excellence', desc: 'We deliver nothing short of the highest quality in every single campaign and unit of code.', color: 'cyan' },
                { title: 'Innovation', desc: 'Continuously pushing boundaries with futuristic technical and marketing solutions.', color: 'purple' },
                { title: 'Integrity', desc: 'Transparent, honest, and ethical in every partnership we build.', color: 'cyan' },
                { title: 'Collaboration', desc: 'Working closely with clients as true architects of their success.', color: 'purple' },
                { title: 'Reliability', desc: 'Delivering on our promises with absolute precision, every time.', color: 'cyan' },
                { title: 'Impact', desc: 'Creating digital solutions that make a tangible difference in growth.', color: 'purple' },
            ])
        },
        {
            page: 'about',
            section: 'milestones',
            content: JSON.stringify([
                { year: '2019', title: 'Company Founded', desc: 'JOVERO established with a vision for digital marketing and tech excellence.' },
                { year: '2020', title: 'Medical Sector Entry', desc: 'Successfully launched our first comprehensive marketing campaign for a medical group.' },
                { year: '2021', title: 'Core Expansion', desc: 'Grew to 20+ specialists across marketing, development and healthcare strategy.' },
                { year: '2022', title: 'Global Reach', desc: 'Extended innovation to medical clients across Europe and the Middle East.' },
                { year: '2023', title: '150+ Projects', desc: 'Milestone of delivering over 150 successful high-performance growth solutions.' },
                { year: '2024', title: 'AI Marketing Hub', desc: 'Launched R&D division for AI integration in healthcare marketing systems.' },
            ])
        },
        {
            page: 'about',
            section: 'tech_arsenal',
            content: JSON.stringify([
                { name: 'Marketing Automation', level: 98 },
                { name: 'SEO & Search Ads', level: 95 },
                { name: 'Content Strategy', level: 96 },
                { name: 'Healthcare Compliance', level: 94 },
                { name: 'Performance Analytics', level: 90 },
            ])
        }
    ];

    for (const sec of pageSections) {
        const existing = await prisma.pageSection.findFirst({
            where: { page: sec.page, section: sec.section }
        });
        if (existing) {
            await prisma.pageSection.update({
                where: { id: existing.id },
                data: { content: sec.content }
            });
        } else {
            await prisma.pageSection.create({
                data: sec
            });
        }
    }
    console.log('🏠 Page sections seeded');

    // 4. Service Categories & Services
    console.log('Sweep old services...');
    await prisma.service.deleteMany();
    await prisma.serviceCategory.deleteMany();

    const catData = [
        { name: 'Marketing', nameEn: 'Marketing', slug: 'marketing', icon: 'TrendingUp', order: 1 },
        { name: 'Design', nameEn: 'Design', slug: 'design', icon: 'Palette', order: 2 },
        { name: 'Development', nameEn: 'Development', slug: 'development', icon: 'Code2', order: 3 },
        { name: 'Healthcare', nameEn: 'Healthcare', slug: 'healthcare', icon: 'Activity', order: 4 },
    ];

    const categoryMap: Record<string, string> = {};
    for (const c of catData) {
        const cat = await prisma.serviceCategory.create({
            data: { ...c, isActive: true }
        });
        categoryMap[c.name] = cat.id;
    }

    const services = [
        {
            title: 'التسويق الطبي والمحتوى الإبداعي',
            titleEn: 'Medical Marketing & Creative Content',
            slug: 'healthcare-marketing-content',
            description: 'نقدم استراتيجيات تسويق متكاملة للأطباء والمراكز الطبية لزيادة التفاعل وجذب المرضى.',
            descriptionEn: 'We provide integrated marketing strategies for doctors and medical centers to increase engagement and attract patients.',
            icon: 'TrendingUp',
            image: '/images/services/healthcare-marketing-content.png',
            features: JSON.stringify(['Patient Acquisition', 'Healthcare SEO', 'Medical Content Creation', 'Social Media Management', 'Paid Ads Strategy', 'Crisis Management']),
            featuresEn: JSON.stringify(['Patient Acquisition', 'Healthcare SEO', 'Medical Content Creation', 'Social Media Management', 'Paid Ads Strategy', 'Crisis Management']),
            categoryName: 'Marketing',
            order: 1
        },
        {
            title: 'تحليل الأداء وتحسين محركات البحث SEO',
            titleEn: 'Performance Analytics & Healthcare SEO',
            slug: 'performance-analytics-seo',
            description: 'نضمن ظهور موقعك في مقدمة نتائج البحث الطبي لزيادة الثقة والمصداقية.',
            descriptionEn: 'We ensure your website appears at the top of medical search results to increase trust and credibility.',
            icon: 'Search',
            image: '/images/services/performance-analytics-seo.png',
            features: JSON.stringify(['Keyword Research', 'On-Page SEO', 'Backlink Strategy', 'Conversion Tracking', 'Data Analysis', 'Competitor Insights']),
            featuresEn: JSON.stringify(['Keyword Research', 'On-Page SEO', 'Backlink Strategy', 'Conversion Tracking', 'Data Analysis', 'Competitor Insights']),
            categoryName: 'Marketing',
            order: 2
        },
        {
            title: 'تصميم الهوية البصرية والمواقع الطبية',
            titleEn: 'Medical Branding & Web Design',
            slug: 'medical-branding-web-design',
            description: 'نصمم هويات بصرية تعكس الاحترافية ومواقع إلكترونية طبية سهلة الاستخدام.',
            descriptionEn: 'We design visual identities that reflect professionalism and user-friendly medical websites.',
            icon: 'Palette',
            image: '/images/services/medical-branding-web-design.png',
            features: JSON.stringify(['Logo & Identity', 'UX for Healthcare', 'Responsive Web Design', 'Medical Icons', 'Print Materials', 'Design Systems']),
            featuresEn: JSON.stringify(['Logo & Identity', 'UX for Healthcare', 'Responsive Web Design', 'Medical Icons', 'Print Materials', 'Design Systems']),
            categoryName: 'Design',
            order: 3
        },
        {
            title: 'تطوير أنظمة الرعاية الصحية الرقمية',
            titleEn: 'Digital Healthcare Systems Development',
            slug: 'healthcare-systems-development',
            description: 'نبني منصات رقمية متقدمة لإدارة المواعيد والسجلات الطبية التفاعلية.',
            descriptionEn: 'We build advanced digital platforms for appointment management and interactive medical records.',
            icon: 'Activity',
            image: '/images/services/healthcare-systems-development.png',
            features: JSON.stringify(['Booking Systems', 'Patient Portals', 'Telehealth Solutions', 'EMR Integration', 'Security & Compliance', 'Mobile Medical Apps']),
            featuresEn: JSON.stringify(['Booking Systems', 'Patient Portals', 'Telehealth Solutions', 'EMR Integration', 'Security & Compliance', 'Mobile Medical Apps']),
            categoryName: 'Healthcare',
            order: 4
        }
    ];

    for (const s of services) {
        const { categoryName, ...serviceData } = s;
        await prisma.service.create({
            data: { ...serviceData, categoryId: categoryMap[categoryName], isActive: true }
        });
    }
    console.log('🛠️ Services seeded');

    // 5. Testimonials
    const testimonials = [
        {
            name: 'Dr. Ahmad Mansour',
            role: 'Founder, Modern Health Clinics',
            content: 'JOVERO transformed our digital presence. Their specialized focus on medical marketing helped us achieve a 40% growth in patient appointments within 6 months.',
            rating: 5,
            order: 1
        },
        {
            name: 'Layla Kareem',
            role: 'Marketing Director, Amman Specialty Center',
            content: 'The team at JOVERO understands the nuances of healthcare. Their content strategy is both professional and highly engaging for patients.',
            rating: 5,
            order: 2
        }
    ];

    for (const t of testimonials) {
        const exists = await prisma.testimonial.findFirst({ where: { name: t.name } });
        if (!exists) {
            await prisma.testimonial.create({ data: t });
        }
    }
    console.log('💬 Testimonials seeded');

    // 6. Portfolio Projects
    const projects = [
        {
            title: 'HealthQuest Patient Portal',
            slug: 'healthquest-portal',
            category: 'Healthcare Systems',
            description: 'A comprehensive patient engagement portal for a multi-specialty medical group.',
            technologies: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Socket.io']),
            isFeatured: true,
            order: 1,
            content: 'Full clinic management solution...',
            client: 'Modern Health Clinics',
            duration: '5 Months',
            image: '/images/portfolio/healthquest-portal.png'
        },
        {
            title: 'Dental Care SEO Growth',
            slug: 'dental-care-seo',
            category: 'Marketing',
            description: 'Focused SEO and content campaign for a chain of dental clinics in the region.',
            technologies: JSON.stringify(['SEO', 'Google Ads', 'Content Strategy', 'Analytics']),
            isFeatured: true,
            order: 2,
            content: 'SEO optimization for dental clinics...',
            client: 'Smile Center Group',
            duration: '1 Year',
            image: '/images/portfolio/dental-care-seo.png'
        }
    ];

    for (const p of projects) {
        await prisma.project.upsert({
            where: { slug: p.slug },
            update: { ...p, image: null },
            create: p
        });
    }
    console.log('🚀 Projects seeded');

    // 7. Team Members
    const teamMembers = [
        { name: 'Zaid Al-Bitar', role: 'CEO & Marketing Architect', bio: 'Strategic leader specializing in healthcare digital transformation.', order: 1 },
        { name: 'Sarah Ali', role: 'Head of Creative Content', bio: 'Expert in medical storytelling and patient engagement strategies.', order: 2 },
    ];

    for (const m of teamMembers) {
        const exists = await prisma.teamMember.findFirst({ where: { name: m.name } });
        if (!exists) await prisma.teamMember.create({ data: m });
    }
    console.log('👥 Team members seeded');

    // 8. FAQs
    const faqs = [
        { question: 'Why choose JOVERO for medical marketing?', answer: 'We specialize specifically in healthcare, ensuring all strategies are ethical, compliant, and highly effective for patient growth.', order: 1 },
        { question: 'Do you offer custom healthcare software?', answer: 'Yes, we build everything from booking systems to full patient management portals.', order: 2 },
    ];

    for (const f of faqs) {
        const exists = await (prisma as any).fAQ.findFirst({ where: { question: f.question } });
        if (!exists) await (prisma as any).fAQ.create({ data: f });
    }
    console.log('❓ FAQs seeded');

    // 9. Blog Categories
    const blogCats = [
        { name: 'Medical Marketing', slug: 'medical-marketing' },
        { name: 'Healthcare ROI', slug: 'healthcare-roi' },
        { name: 'Patient Engagement', slug: 'patient-engagement' },
        { name: 'Tech Insights', slug: 'tech-insights' },
    ];

    const blogCatMap: Record<string, string> = {};
    for (const c of blogCats) {
        const cat = await prisma.blogCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
        blogCatMap[c.slug] = cat.id;
    }
    console.log('📝 Blog categories seeded');

    // 11. SEO Meta
    const seoPages = [
        { page: 'home', title: 'JOVERO | Healthcare Marketing \u0026 Tech Agency', description: 'JOVERO specializes in medical marketing and healthcare digital transformation. Grow your practice today.' },
        { page: 'about', title: 'About JOVERO | Our Vision for Healthcare Marketing', description: 'Learn about JOVERO, the leading agency for medical professionals.' },
        { page: 'services', title: 'Our Services | Medical Marketing, SEO \u0026 Healthcare Tech', description: 'Specialized healthcare marketing, SEO, and custom software development services.' },
        { page: 'portfolio', title: 'Portfolio | Medical Growth Success Stories', description: 'View our track record of helping doctors and medical centers grow.' },
        { page: 'blog', title: 'JOVERO Insights | Healthcare Marketing Tips', description: 'Latest trends in medical marketing and patient acquisition.' },
        { page: 'contact', title: 'Contact Us | Start Your Growth Journey', description: 'Get in touch with our healthcare marketing experts today.' },
    ];

    for (const s of seoPages) {
        await prisma.seoMeta.upsert({ where: { page: s.page }, update: {}, create: s });
    }
    console.log('🔍 SEO meta seeded');

    console.log('\n🎉 Seed completed successfully!');
    console.log('📧 Admin login: admin@jovero.com / admin123');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
