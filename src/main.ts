import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import prisma from './lib/prisma';
import * as bcrypt from 'bcryptjs';

if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    console.error('CRITICAL: DATABASE_URL is not defined in the environment!');
}

// Routes
import authRoutes from './routes/auth';
import publicRoutes from './routes/public';
import adminRoutes from './routes/admin';
import systemRoutes from './routes/system';

function log(msg: string) {
    console.log(`[${new Date().toISOString()}] ${msg}`);
}

const app = express();
const PORT = process.env.PORT || 5001;

// ============ MIDDLEWARE ============

// Security
app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// CORS
const allowedOrigins = process.env.FRONTEND_URL?.split(',') || [];
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);

        // Normalize origin and allowed origins by removing trailing slashes
        const normalizedOrigin = origin.replace(/\/$/, '');
        const normalizedAllowedOrigins = allowedOrigins.map(ao => ao.replace(/\/$/, ''));

        const isAllowed = normalizedAllowedOrigins.some(ao => normalizedOrigin === ao || normalizedOrigin.startsWith(ao));
        const isVercel = normalizedOrigin.endsWith('.vercel.app');
        const isLocal = normalizedOrigin.includes('localhost') || normalizedOrigin.includes('127.0.0.1');
        const isTech = normalizedOrigin.endsWith('.jovero.net') || normalizedOrigin === 'https://jovero.net' ||
            normalizedOrigin.endsWith('.jovero.com') || normalizedOrigin === 'https://jovero.com';

        if (isAllowed || isVercel || isLocal || isTech) {
            callback(null, true);
        } else {
            console.log(`[CORS] Blocked origin: ${origin} (Normalized: ${normalizedOrigin})`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));

// Rate limiting
app.use(rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX) || 100,
    message: { error: 'Too many requests, please try again later.' },
}));

// Body parsing - Increased for Data URIs (Vercel)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Static files (uploads)
app.use('/uploads', express.static('uploads'));

// ============ ROUTES ============

app.use('/api/auth', authRoutes);
app.use('/api', publicRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/system', systemRoutes);

// Health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        databaseUrlDetected: !!process.env.DATABASE_URL,
        nodeEnv: process.env.NODE_ENV
    });
});

// Root check
app.get('/api', (_req, res) => {
    res.json({ message: 'JOVERO Backend API is running', version: '1.0.0' });
});

app.get('/', (_req, res) => {
    res.json({ message: 'JOVERO Backend is running', version: '1.0.0' });
});

// ============ ERROR HANDLING ============

app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    });
});

// 404
app.use((_req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ============ START ============

async function initialize() {
    log('🚀 Initializing server...');
    try {
        await prisma.$connect();
        log('✅ Database connected');
    } catch (error: any) {
        log(`❌ Database connection failed: ${error.message}`);
    }

    // Auto-seed admin user
    try {
        const adminEmail = 'info@jovero.net';
        const exists = await prisma.user.findUnique({ where: { email: adminEmail } });
        if (!exists) {
            const hashedPassword = await bcrypt.hash('admin123', 12);
            await prisma.user.create({
                data: {
                    email: adminEmail,
                    password: hashedPassword,
                    name: 'Admin',
                    role: 'ADMIN',
                }
            });
            log('✅ Default admin user created');
        }
    } catch (err: any) {
        log(`❌ Auto-seed failed: ${err.message}`);
    }

    // Seed essential settings
    try {
        const essentialSettings = [
            { key: 'companyName', value: 'JOVERO' },
            { key: 'email', value: 'info@jovero.net' }
        ];

        for (const s of essentialSettings) {
            await prisma.siteSetting.upsert({
                where: { key: s.key },
                update: {},
                create: { key: s.key, value: s.value }
            });
        }
        log('✅ Essential site settings verified');
    } catch (err: any) {
        log(`❌ Settings seed failed: ${err.message}`);
    }
}

// Check if we are in Vercel or local
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(Number(PORT), '0.0.0.0', async () => {
        log(`🚀 Server running locally on http://localhost:${PORT}`);
        await initialize();
    });
} else {
    // In Vercel, we avoid top-level async work to prevent bootstrap timeouts/crashes.
    // The user will trigger initialization manually via /api/system/init-db.
    log('🚀 Running in Vercel mode (Lazy Initialization)');
}

// Graceful shutdown
process.on('SIGINT', async () => {
    await prisma.$disconnect();
    process.exit(0);
});

export { prisma };
export default app;
