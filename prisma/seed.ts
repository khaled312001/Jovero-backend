import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting JOVERO comprehensive seed...');

    // 1. Admin User
    const adminEmail = 'info@jovero.net';
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
        { key: 'email', value: 'info@jovero.net' },
        { key: 'phone', value: '+201055709709' },
        { key: 'address', value: 'Amman, Jordan' },
        { key: 'license', value: 'JOVERO-2026-HQ' },
        { key: 'whatsappNumber', value: '+201055709709' },
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
                badgeTextAr: "وكالة رائدة في التسويق الطبي",
                titleLine1: "JOVERO:",
                titleLine1Ar: "جوفيرو:",
                titleLine2: "Digital Growth for Medical Professionals",
                titleLine2Ar: "النمو الرقمي للمهنيين الطبيين",
                description: "We architect enterprise-grade marketing and software solutions tailored for the medical field. From patient acquisition systems to high-performance healthcare platforms, we turn your practice into a digital leader.",
                descriptionAr: "نحن نصمم حلول تسويق وبرمجيات على مستوى المؤسسات مصممة خصيصاً للمجال الطبي. من أنظمة جذب المرضى إلى منصات الرعاية الصحية عالية الأداء، نحول ممارستك إلى ريادة رقمية.",
                primaryBtnText: "Start Your Growth",
                primaryBtnTextAr: "ابدأ نموك",
                secondaryBtnText: "View Our Portfolio",
                secondaryBtnTextAr: "شاهد أعمالنا"
            })
        },
        {
            page: 'home',
            section: 'features',
            content: JSON.stringify({
                badge: "Core Values",
                badgeAr: "القيم الجوهرية",
                title: "Built on Precision & Strategic Excellence",
                titleAr: "بنيت على الدقة والتميز الاستراتيجي",
                description: "We combine engineering discipline with global rapid innovation to deliver digital solutions that redefine industry standards in healthcare marketing and performance.",
                descriptionAr: "نحن نجمع بين الانضباط الهندسي والابتكار العالمي السريع لتقديم حلول رقمية تعيد تشريف معايير الصناعة في تسويق الرعاية الصحية والأداء.",
                btnText: "Our Strategic Approach",
                btnTextAr: "نهجنا الاستراتيجي"
            })
        },
        {
            page: 'home',
            section: 'stats',
            content: JSON.stringify({
                stats: [
                    { label: "Successful Campaigns", labelAr: "حملة ناجحة", value: "200", suffix: "+" },
                    { label: "Medical Partners", labelAr: "شريك طبي", value: "120", suffix: "+" },
                    { label: "Years of Experience", labelAr: "سنوات من الخبرة", value: "6", suffix: "+" },
                    { label: "Patient Growth", labelAr: "نمو في عدد المرضى", value: "100", suffix: "%" },
                ]
            })
        },
        {
            page: 'home',
            section: 'cta',
            content: JSON.stringify({
                badge: "Initiation",
                badgeAr: "البداية",
                title: "Accelerate Your Practice",
                titleAr: "سرّع ممارستك",
                description: "Our team of marketing experts is ready to architect your digital future. Let's turn your vision into a strategic marketing asset that drives patient engagement and growth.",
                descriptionAr: "فريقنا من خبراء التسويق جاهز لتصميم مستقبلك الرقمي. لنحول رؤيتك إلى أصل تسويقي استراتيجي يحفز مشاركة المرضى ونموهم."
            })
        },
        {
            page: 'home',
            section: 'tech',
            content: JSON.stringify({
                badge: "Growth Ecosystem",
                badgeAr: "منظومة النمو",
                titleLine1: "Marketing",
                titleLine1Ar: "تميز",
                titleHighlight: "Excellence",
                titleHighlightAr: "تسويقي",
                subtitle: "We architect high-impact marketing strategies using the world's most sophisticated digital growth frameworks.",
                subtitleAr: "نصمم استراتيجيات تسويقية عالية التأثير باستخدام أكثر أطر النمو الرقمي تطوراً في العالم."
            })
        },
        // --- ABOUT ---
        {
            page: 'about',
            section: 'values',
            content: JSON.stringify([
                { title: 'Excellence', titleAr: 'التميز', desc: 'We deliver nothing short of the highest quality in every single campaign and unit of code.', descAr: 'نحن نقدم أرقى مستويات الجودة في كل حملة ووحدة برمجية.', color: 'purple' },
                { title: 'Innovation', titleAr: 'الابتكار', desc: 'Continuously pushing boundaries with futuristic technical and marketing solutions.', descAr: 'دفع الحدود باستمرار مع حلول تقنية وتسويقية مستقبلية.', color: 'purple' },
                { title: 'Integrity', titleAr: 'النزاهة', desc: 'Transparent, honest, and ethical in every partnership we build.', descAr: 'شفافون وصادقون وأخلاقيون في كل شراكة نبنيها.', color: 'purple' },
                { title: 'Collaboration', titleAr: 'التعاون', desc: 'Working closely with clients as true architects of their success.', descAr: 'العمل عن كثب مع العملاء كمهندسين حقيقيين لنجاحهم.', color: 'purple' },
                { title: 'Reliability', titleAr: 'الموثوقية', desc: 'Delivering on our promises with absolute precision, every time.', descAr: 'الوفاء بوعودنا بدقة مطلقة في كل مرة.', color: 'purple' },
                { title: 'Impact', titleAr: 'الأثر', desc: 'Creating digital solutions that make a tangible difference in growth.', descAr: 'إنشاء حلول رقمية تحدث فرقاً ملموساً في النمو.', color: 'purple' },
            ])
        },
        {
            page: 'about',
            section: 'milestones',
            content: JSON.stringify([
                { year: '2019', title: 'Company Founded', titleAr: 'تأسيس الشركة', desc: 'JOVERO established with a vision for digital marketing and tech excellence.', descAr: 'تأسست JOVERO برؤية للتميز في التسويق الرقمي والتكنولوجيا.' },
                { year: '2020', title: 'Medical Sector Entry', titleAr: 'دخول القطاع الطبي', desc: 'Successfully launched our first comprehensive marketing campaign for a medical group.', descAr: 'ألفلقنا بنجاح أول حملة تسويقية شاملة لمجموعة طبية.' },
                { year: '2021', title: 'Core Expansion', titleAr: 'التوسع الأساسي', desc: 'Grew to 20+ specialists across marketing, development and healthcare strategy.', descAr: 'كبرنا لنصبح أكثر من 20 متخصصاً في التسويق والتطوير واستراتيجية الرعاية الصحية.' },
                { year: '2022', title: 'Global Reach', titleAr: 'الوصول العالمي', desc: 'Extended innovation to medical clients across Europe and the Middle East.', descAr: 'مددنا الابتكار لعملاء القطاع الطبي عبر أوروبا والشرق الأوسط.' },
                { year: '2023', title: '150+ Projects', titleAr: '+150 مشروع', desc: 'Milestone of delivering over 150 successful high-performance growth solutions.', descAr: 'إنجاز تسليم أكثر من 150 حلاً ناجحاً للنمو عالي الأداء.' },
                { year: '2024', title: 'AI Marketing Hub', titleAr: 'مركز تسويق الذكاء الاصطناعي', desc: 'Launched R&D division for AI integration in healthcare marketing systems.', descAr: 'أطلقنا قسم البحث والتطوير لتكامل الذكاء الاصطناعي في أنظمة التسويق للرعاية الصحية.' },
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
            name: 'د. أحمد منصور',
            nameEn: 'Dr. Ahmad Mansour',
            role: 'مؤسس عيادات "مودرن هيلث"',
            roleEn: 'Founder, Modern Health Clinics',
            content: 'لقد أحدثت JOVERO تحولاً جذرياً في حضورنا الرقمي. ساعدنا تركيزهم المتخصص في التسويق الطبي على تحقيق نمو بنسبة 40% في مواعيد المرضى خلال 6 أشهر.',
            contentEn: 'JOVERO transformed our digital presence. Their specialized focus on medical marketing helped us achieve a 40% growth in patient appointments within 6 months.',
            rating: 5,
            order: 1
        },
        {
            name: 'ليلى كريم',
            nameEn: 'Layla Kareem',
            role: 'مديرة التسويق، مركز عمان التخصصي',
            roleEn: 'Marketing Director, Amman Specialty Center',
            content: 'الفريق في JOVERO يدرك تماماً تفاصيل قطاع الرعاية الصحية. استراتيجية المحتوى لديهم مهنية وجذابة للغاية للمرضى.',
            contentEn: 'The team at JOVERO understands the nuances of healthcare. Their content strategy is both professional and highly engaging for patients.',
            rating: 5,
            order: 2
        }
    ];

    for (const t of testimonials) {
        const exists = await prisma.testimonial.findFirst({ where: { nameEn: t.nameEn } });
        if (!exists) {
            await prisma.testimonial.create({ data: t });
        } else {
            await prisma.testimonial.update({ where: { id: exists.id }, data: t });
        }
    }
    console.log('💬 Testimonials seeded');

    // 6. Portfolio Projects
    const projects = [
        {
            title: 'بوابة المريض HealthQuest',
            titleEn: 'HealthQuest Patient Portal',
            slug: 'healthquest-portal',
            category: 'أنظمة الرعاية الصحية',
            categoryEn: 'Healthcare Systems',
            description: 'بوابة شاملة لمشاركة المرضى لمجموعة طبية متعددة التخصصات.',
            descriptionEn: 'A comprehensive patient engagement portal for a multi-specialty medical group.',
            technologies: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Socket.io']),
            isFeatured: true,
            order: 1,
            content: 'حل كامل لإدارة العيادات...',
            client: 'Modern Health Clinics',
            duration: '5 Months',
            image: '/images/portfolio/healthquest-portal.png'
        },
        {
            title: 'نمو الـ SEO لعيادات الأسنان',
            titleEn: 'Dental Care SEO Growth',
            slug: 'dental-care-seo',
            category: 'توزيق',
            categoryEn: 'Marketing',
            description: 'حملة SEO ومحتوى مركزة لسلسلة من عيادات الأسنان في المنطقة.',
            descriptionEn: 'Focused SEO and content campaign for a chain of dental clinics in the region.',
            technologies: JSON.stringify(['SEO', 'Google Ads', 'Content Strategy', 'Analytics']),
            isFeatured: true,
            order: 2,
            content: 'تحسين محركات البحث لعيادات الأسنان...',
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
        {
            name: 'زيد البيطار',
            nameEn: 'Zaid Al-Bitar',
            role: 'الرئيس التنفيذي ومهندس التسويق',
            roleEn: 'CEO & Marketing Architect',
            bio: 'قائد استراتيجي متخصص في التحول الرقمي للرعاية الصحية.',
            bioEn: 'Strategic leader specializing in healthcare digital transformation.',
            order: 1
        },
        {
            name: 'سارة علي',
            nameEn: 'Sarah Ali',
            role: 'رئيسة المحتوى الإبداعي',
            roleEn: 'Head of Creative Content',
            bio: 'خبيرة في سرد القصص الطبية واستراتيجيات مشاركة المرضى.',
            bioEn: 'Expert in medical storytelling and patient engagement strategies.',
            order: 2
        },
    ];

    for (const m of teamMembers) {
        const exists = await prisma.teamMember.findFirst({ where: { nameEn: m.nameEn } });
        if (!exists) {
            await prisma.teamMember.create({ data: m });
        } else {
            await prisma.teamMember.update({ where: { id: exists.id }, data: m });
        }
    }
    console.log('👥 Team members seeded');

    // 8. FAQs
    const faqs = [
        {
            question: 'لماذا تختار JOVERO للتسويق الطبي؟',
            questionEn: 'Why choose JOVERO for medical marketing?',
            answer: 'نحن متخصصون حصرياً في الرعاية الصحية، مما يضمن أن جميع الاستراتيجيات أخلاقية ومتوافقة وفعالة للغاية لنمو المرضى.',
            answerEn: 'We specialize specifically in healthcare, ensuring all strategies are ethical, compliant, and highly effective for patient growth.',
            order: 1
        },
        {
            question: 'هل تقدمون برمجيات مخصصة للرعاية الصحية؟',
            questionEn: 'Do you offer custom healthcare software?',
            answer: 'نعم، نبني كل شيء من أنظمة الحجز إلى بوابات إدارة المرضى الكاملة.',
            answerEn: 'Yes, we build everything from booking systems to full patient management portals.',
            order: 2
        },
    ];

    for (const f of faqs) {
        const exists = await (prisma as any).fAQ.findFirst({ where: { questionEn: f.questionEn } });
        if (!exists) {
            await (prisma as any).fAQ.create({ data: f });
        } else {
            await (prisma as any).fAQ.update({ where: { id: exists.id }, data: f });
        }
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
        {
            page: 'home',
            title: 'JOVERO | وكالة التسويق الطبي والتقني برؤية سويسرية',
            titleEn: 'JOVERO | Healthcare Marketing & Tech Agency',
            description: 'تتخصص JOVERO في التسويق الطبي والتحول الرقمي للرعاية الصحية. بادر بنمو عيادتك اليوم.',
            descriptionEn: 'JOVERO specializes in medical marketing and healthcare digital transformation. Grow your practice today.'
        },
        {
            page: 'about',
            title: 'حول JOVERO | رؤيتنا للتميز في التسويق الطبي',
            titleEn: 'About JOVERO | Our Vision for Healthcare Marketing',
            description: 'تعرف على JOVERO، الوكالة الرائدة لممارسي القطاع الطبي في المنطقة.',
            descriptionEn: 'Learn about JOVERO, the leading agency for medical professionals.'
        },
        {
            page: 'services',
            title: 'خدماتنا | التسويق الطبي، الـ SEO وتقنيات الرعاية الصحية',
            titleEn: 'Our Services | Medical Marketing, SEO & Healthcare Tech',
            description: 'خدمات متخصصة في تسويق الرعاية الصحية، تحسين محركات البحث، وتطوير البرمجيات الطبية المخصصة.',
            descriptionEn: 'Specialized healthcare marketing, SEO, and custom software development services.'
        },
        {
            page: 'portfolio',
            title: 'أعمالنا | قصص نجاح النمو الطبي الرقمي',
            titleEn: 'Portfolio | Medical Growth Success Stories',
            description: 'شاهد سجل أعمالنا الحافل بمساعدة الأطباء والمراكز الطبية على النمو والتوسع.',
            descriptionEn: 'View our track record of helping doctors and medical centers grow.'
        },
        {
            page: 'blog',
            title: 'رؤى JOVERO | نصائح واستراتيجيات التسويق الطبي',
            titleEn: 'JOVERO Insights | Healthcare Marketing Tips',
            description: 'أحدث التوجهات في التسويق الطبي وجذب المرضى وتحسين الأداء الرقمي.',
            descriptionEn: 'Latest trends in medical marketing and patient acquisition.'
        },
        {
            page: 'contact',
            title: 'تواصل معنا | ابدأ رحلة نمو عيادتك الرقمية',
            titleEn: 'Contact Us | Start Your Growth Journey',
            description: 'تواصل مع خبرائنا في تسويق الرعاية الصحية اليوم لتحويل ممارستك إلى ريادة رقمية.',
            descriptionEn: 'Get in touch with our healthcare marketing experts today.'
        },
    ];

    for (const s of seoPages) {
        await prisma.seoMeta.upsert({ where: { page: s.page }, update: { ...s }, create: s });
    }
    console.log('🔍 SEO meta seeded');

    console.log('\n🎉 Seed completed successfully!');
    console.log('📧 Admin login: info@jovero.net / admin123');
}

main()
    .catch((e) => {
        console.error('Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
