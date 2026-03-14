import prisma from './prisma';
import * as bcrypt from 'bcryptjs';

export async function seedTranslations() {
    const logs: string[] = [];
    const log = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${msg}`);
        logs.push(`[${timestamp}] ${msg}`);
    };

    try {
        log('📝 Starting page sections (translations) seed...');

        const pageSections = [
            {
                page: 'home',
                section: 'hero',
                content: JSON.stringify({
                    badgeText: "وكالة تسويق رقمي رائدة",
                    titleLine1: "جوفيرو:",
                    titleLine2: "ابتكار لنموّك الرقمي",
                    description: "نصمم ونبني أنظمة تسويق وحلول برمجية مؤسسية مخصصة للقطاع الطبي. من أنظمة استقطاب المرضى إلى منصات الرعاية الصحية عالية الأداء، نحول عيادتك أو مركزك لرواد في المجال الرقمي.",
                    primaryBtnText: "ابدأ نموك الآن",
                    secondaryBtnText: "استكشف أعمالنا"
                })
            },
            {
                page: 'home',
                section: 'features',
                content: JSON.stringify({
                    badge: "قيمنا الأساسية",
                    title: "مبني على التميز الاستراتيجي والدقة",
                    description: "نجمع بين الانضباط الهندسي والابتكار السريع العالمي لتقديم حلول رقمية تعيد صياغة معايير التسويق والأداء في قطاع الرعاية الصحية.",
                    btnText: "منهجنا الاستراتيجي"
                })
            },
            {
                page: 'home',
                section: 'stats',
                content: JSON.stringify({
                    stats: [
                        { label: "حملة ناجحة", value: "200", suffix: "+" },
                        { label: "شريك طبي", value: "120", suffix: "+" },
                        { label: "سنوات من الخبرة", value: "6", suffix: "+" },
                        { label: "نمو في عدد المرضى", value: "100", suffix: "%" },
                    ]
                })
            },
            {
                page: 'home',
                section: 'cta',
                content: JSON.stringify({
                    badge: "البداية",
                    title: "سرّع عجلة نمو عيادتك",
                    description: "فريقنا من خبراء التسويق جاهز لبناء مستقبلك الرقمي. دعنا نحول رؤيتك إلى أصل تسويقي استراتيجي يدفع عجلة التفاعل والنمو."
                })
            },
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
        log('✅ Page sections (translations) seeded successfully');
        return { success: true, logs };
    } catch (error: any) {
        log(`❌ Page sections seeding failed: ${error.message}`);
        return { success: false, logs };
    }
}

export async function seedDatabase() {
    const logs: string[] = [];
    const log = (msg: string) => {
        const timestamp = new Date().toLocaleTimeString();
        console.log(`[${timestamp}] ${msg}`);
        logs.push(`[${timestamp}] ${msg}`);
    };

    try {
        log('🌱 Starting comprehensive seed...');

        // 1. Admin User
        const adminEmail = 'info@jovero.net';
        const password = await bcrypt.hash('admin123', 12);

        await prisma.user.upsert({
            where: { email: adminEmail },
            update: {},
            create: {
                email: adminEmail,
                password,
                name: 'JOVERO Admin',
                role: 'ADMIN',
            },
        });
        log('👤 Admin user verified');

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
        log('⚙️ Site settings seeded');

        // 3. Page Sections
        const translationsResult = await seedTranslations();
        logs.push(...translationsResult.logs);
        log('🏠 Page sections seeded');

        // 4. Service Categories & Services
        await prisma.service.deleteMany({});
        await prisma.serviceCategory.deleteMany({});
        log('🗑️ Cleared existing services and categories');

        const catData = [
            { name: 'التسويق', nameEn: 'Marketing', slug: 'marketing', icon: 'TrendingUp' },
            { name: 'التصميم', nameEn: 'Design', slug: 'design', icon: 'Palette' },
            { name: 'التطوير', nameEn: 'Development', slug: 'development', icon: 'Code2' },
            { name: 'الرعاية الصحية', nameEn: 'Healthcare', slug: 'healthcare', icon: 'Activity' },
        ];

        const categoryMap: Record<string, string> = {};
        for (const c of catData) {
            const cat = await prisma.serviceCategory.upsert({
                where: { slug: c.slug },
                update: {},
                create: c
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
                features: JSON.stringify(['استقطاب المرضى', 'تحسين محركات البحث الطبي', 'إنشاء المحتوى الطبي', 'إدارة منصات التواصل', 'استراتيجية الإعلانات الممولة', 'إدارة الأزمات']),
                categoryName: 'التسويق',
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
                features: JSON.stringify(['بحث الكلمات المفتاحية', 'السيو الداخلي', 'استراتيجية الروابط الخلفية', 'تتبع التحويلات', 'تحليل البيانات', 'رؤى المنافسين']),
                categoryName: 'التسويق',
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
                features: JSON.stringify(['الشعار والهوية المؤسسية', 'تجربة المستخدم للمرضى', 'تصميم متجاوب', 'أيقونات طبية', 'المواد المطبوعة', 'أنظمة التصميم']),
                categoryName: 'التصميم',
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
                features: JSON.stringify(['أنظمة الحجز', 'بوابات المرضى', 'حلول الرعاية عن بُعد', 'تكامل السجلات الطبية', 'الأمان والامتثال', 'تطبيقات طبية']),
                categoryName: 'الرعاية الصحية',
                order: 4
            }
        ];

        for (const s of services) {
            const { categoryName, ...serviceData } = s;
            await prisma.service.create({
                data: { ...serviceData, categoryId: categoryMap[categoryName], isActive: true }
            });
        }
        log('🛠️ Services seeded');

        // 5. Testimonials
        const testimonials = [
            {
                name: 'د. أحمد منصور',
                role: 'مؤسس، عيادات الصحة الحديثة',
                content: 'جوفيرو حولت حضورنا الرقمي بشكل جذري. تركيزهم المتخصص على التسويق الطبي ساعدنا في تحقيق نمو بنسبة 40% في حجوزات المرضى خلال 6 أشهر فقط.',
                rating: 5,
                order: 1
            },
            {
                name: 'ليلى كريم',
                role: 'مديرة التسويق، مركز عمان التخصصي',
                content: 'فريق جوفيرو يفهم بدقة تفاصيل قطاع الرعاية الصحية. استراتيجية المحتوى الخاصة بهم احترافية للغاية وجذابة للمرضى.',
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
        log('💬 Testimonials seeded');

        // 6. Portfolio Projects
        await prisma.projectImage.deleteMany({});
        await prisma.project.deleteMany({});
        log('🗑️ Cleared existing projects');

        const projects = [
            {
                title: 'بوابة HealthQuest للمرضى',
                titleEn: 'HealthQuest Patient Portal',
                slug: 'healthquest-portal',
                category: 'أنظمة الرعاية الصحية',
                categoryEn: 'Healthcare Systems',
                description: 'بوابة تفاعلية شاملة لمجموعة طبية متعددة التخصصات.',
                descriptionEn: 'A comprehensive patient engagement portal for a multi-specialty medical group.',
                technologies: JSON.stringify(['React', 'Node.js', 'PostgreSQL', 'Socket.io']),
                isFeatured: true,
                order: 1,
                content: 'حل متكامل لإدارة العيادات...',
                client: 'عيادات الصحة الحديثة',
                duration: '5 أشهر',
                image: '/images/portfolio/healthquest-portal.png'
            },
            {
                title: 'نمو عيادات الأسنان عبر SEO',
                titleEn: 'Dental Care SEO Growth',
                slug: 'dental-care-seo',
                category: 'التسويق',
                categoryEn: 'Marketing',
                description: 'حملة تحسين محركات البحث والمحتوى لسلسلة عيادات أسنان في المنطقة.',
                descriptionEn: 'Focused SEO and content campaign for a chain of dental clinics in the region.',
                technologies: JSON.stringify(['SEO', 'Google Ads', 'استراتيجية المحتوى', 'تحليل البيانات']),
                isFeatured: true,
                order: 2,
                content: 'تحسين محركات البحث لعيادات الأسنان...',
                client: 'مجموعة مراكز الابتسامة',
                duration: 'سنة واحدة',
                image: '/images/portfolio/dental-care-seo.png'
            }
        ];

        for (const p of projects) {
            await prisma.project.create({ data: p });
        }
        log('🚀 Projects seeded (' + projects.length + ' projects)');

        // 7. Team Members
        const teamMembers = [
            { name: 'زيد البيطار', role: 'الرئيس التنفيذي ومهندس التسويق', bio: 'قائد استراتيجي متخصص في التحول الرقمي للرعاية الصحية.', order: 1 },
            { name: 'سارة علي', role: 'رئيسة المحتوى الإبداعي', bio: 'خبيرة في السرد القصصي الطبي واستراتيجيات تفاعل المرضى.', order: 2 },
        ];

        for (const m of teamMembers) {
            const exists = await prisma.teamMember.findFirst({ where: { name: m.name } });
            if (!exists) await prisma.teamMember.create({ data: m });
        }
        log('👥 Team members seeded');

        // 8. FAQs
        const faqs = [
            { question: 'لماذا أختار جوفيرو للتسويق الطبي؟', answer: 'نحن متخصصون حصرياً في الرعاية الصحية، مما يضمن أن جميع استراتيجياتنا أخلاقية ومتوافقة وفعالة للغاية في نمو عدد المرضى.', order: 1 },
            { question: 'هل تقدمون برامج رعاية صحية مخصصة؟', answer: 'نعم، نحن نبني كل شيء بدءاً من أنظمة الحجز وحتى بوابات إدارة المرضى المتكاملة.', order: 2 },
        ];

        for (const f of faqs) {
            const exists = await (prisma as any).fAQ.findFirst({ where: { question: f.question } });
            if (!exists) await (prisma as any).fAQ.create({ data: f });
        }
        log('❓ FAQs seeded');

        // 9. Blog Categories
        const blogCats = [
            { name: 'التسويق الطبي', slug: 'medical-marketing' },
            { name: 'العائد على الاستثمار في الرعاية الصحية', slug: 'healthcare-roi' },
            { name: 'تفاعل المرضى', slug: 'patient-engagement' },
            { name: 'رؤى تقنية', slug: 'tech-insights' },
        ];

        const blogCatMap: Record<string, string> = {};
        for (const c of blogCats) {
            const cat = await prisma.blogCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
            blogCatMap[c.slug] = cat.id;
        }
        log('📝 Blog categories seeded');

        // 10. Blog Posts
        const adminUser = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (adminUser) {
            const blogPosts = [
                {
                    title: 'The Future of Patient Acquisition in 2026',
                    slug: 'future-patient-acquisition-2026',
                    excerpt: 'How AI and digital precision are transforming how medical practices grow and engage with patients.',
                    content: `
<h2>The Evolution of Medical Marketing</h2>
<p>In the rapidly evolving digital landscape of 2026, patient acquisition is no longer just about visibility—it's about strategic precision. At <strong>JOVERO</strong>, we've pioneered a data-driven approach that combines healthcare compliance with cutting-edge marketing technology.</p>
<h3>Key Pillars of Modern Patient Growth:</h3>
<ul>
<li><strong>AI-Powered Targeting:</strong> Reaching the right patients at the right time with specialized medical intent.</li>
<li><strong>Reputation Engineering:</strong> Building trust through authentic patient success stories and verified reviews.</li>
<li><strong>Conversion Optimization:</strong> Streamlining the patient journey from first click to appointment booking.</li>
</ul>
<p>As we look ahead, the practices that win will be those that treat their digital presence as a core medical asset.</p>
`,
                    categoryId: blogCatMap['medical-marketing'],
                    image: '/images/blog/patient-acquisition.png',
                    status: 'PUBLISHED',
                    metaTitle: 'Patient Acquisition Trends 2026 | JOVERO Healthcare Marketing',
                    metaDesc: 'Discover how JOVERO is redefining patient acquisition for medical practices in 2026 using AI and strategic digital growth.',
                    readTime: '5 min read',
                    publishedAt: new Date('2026-03-01')
                },
                {
                    title: 'Why Healthcare SEO is Different',
                    slug: 'healthcare-seo-differences',
                    excerpt: 'Understanding the unique challenges and opportunities of search engine optimization for the medical sector.',
                    content: `
<h2>SEO for the Medical Industry</h2>
<p>Search engine optimization for healthcare isn't just about keywords; it's about authority and trust. Google's E-E-A-T (Experience, Expertise, Authoritativeness, and Trustworthiness) guidelines are nowhere more critical than in the medical field.</p>
<blockquote>"In healthcare marketing, your content doesn't just need to be found—it needs to be trusted." — JOVERO Strategy Team</blockquote>
<p>Our specialized SEO frameworks at JOVERO focus on building long-term organic authority for clinics and medical groups, ensuring they remain the first choice for patients searching for care.</p>
`,
                    categoryId: blogCatMap['healthcare-roi'],
                    image: '/images/blog/healthcare-seo.png',
                    status: 'PUBLISHED',
                    metaTitle: 'Medical SEO Strategy | JOVERO Digital Growth',
                    metaDesc: 'Learn why SEO for healthcare requires a specialized approach and how JOVERO helps medical practices dominate search results.',
                    readTime: '6 min read',
                    publishedAt: new Date('2026-02-15')
                }
            ];

            for (const post of blogPosts) {
                await prisma.blogPost.upsert({
                    where: { slug: post.slug },
                    update: { ...post, authorId: adminUser.id, keywords: '[]' },
                    create: { ...post, authorId: adminUser.id, keywords: '[]' }
                });
            }
            log('📚 Blog posts seeded with JOVERO marketing content');
        }

        // 11. SEO Meta
        const seoPages = [
            { page: 'home', title: 'جوفيرو | وكالة التسويق والتقنية الطبية', description: 'تتخصص جوفيرو في التسويق الطبي والتحول الرقمي للرعاية الصحية. نمِّ عيادتك اليوم.' },
            { page: 'about', title: 'نبذة عن جوفيرو | رؤيتنا للتسويق الموجه للرعاية الصحية', description: 'تعرف على جوفيرو، الوكالة الرائدة للمهنيين الطبيين.' },
            { page: 'services', title: 'خدماتنا | التسويق الطبي و SEO والتقنية الصحية', description: 'خدمات تسويق متخصص للرعاية الصحية، وتحسين محركات البحث، وتطوير برمجيات مخصصة.' },
            { page: 'portfolio', title: 'أعمالنا | قصص نجاح النمو الطبي', description: 'اطلع على سجلنا الحافل في مساعدة الأطباء والمراكز الطبية على النمو.' },
            { page: 'blog', title: 'رؤى جوفيرو | نصائح التسويق الطبي', description: 'أحدث التوجهات في التسويق الطبي واستقطاب المرضى.' },
            { page: 'contact', title: 'اتصل بنا | ابدأ رحلة نموك', description: 'تواصل مع خبراء التسويق الموجه للرعاية الصحية اليوم.' },
            { page: 'repair', title: 'إصلاح النظام والتهيئة', description: 'أداة طوارئ لإصلاح قواعد البيانات والنظام.' },
        ];

        for (const s of seoPages) {
            await prisma.seoMeta.upsert({ where: { page: s.page }, update: {}, create: s });
        }
        log('🔍 SEO meta seeded');

        log('🎉 Seeding successfully completed!');
        return { success: true, logs };

    } catch (error: any) {
        log(`❌ Seeding failed: ${error.message}`);
        return { success: false, logs };
    }
}
