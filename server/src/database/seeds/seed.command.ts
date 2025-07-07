import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { DatabaseSeeder } from './database-seeder';

async function bootstrap() {
    console.log('🌱 Starting database seeding process...');

    const appContext = await NestFactory.createApplicationContext(SeederModule);
    const seeder = appContext.get(DatabaseSeeder);

    try {
        await seeder.seed();
        console.log('🎉 Database seeding completed successfully!');
        console.log('\n📋 Test Accounts Created:');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('👤 ADMIN ACCOUNTS:');
        console.log('   📧 admin@ridebooking.com | 🔐 password123');
        console.log('   📧 manager@ridebooking.com | 🔐 password123');
        console.log('');
        console.log('👥 CUSTOMER ACCOUNTS:');
        console.log('   📧 john.doe@example.com | 🔐 password123');
        console.log('   📧 jane.smith@example.com | 🔐 password123');
        console.log('   📧 mike.johnson@example.com | 🔐 password123');
        console.log('');
        console.log('🚗 DRIVER ACCOUNTS:');
        console.log('   📧 driver1@ridebooking.com | 🔐 password123 (Alex Rodriguez)');
        console.log('   📧 driver2@ridebooking.com | 🔐 password123 (Sarah Wilson)');
        console.log('   📧 driver3@ridebooking.com | 🔐 password123 (David Brown)');
        console.log('');
        console.log('🏢 B2B ACCOUNTS:');
        console.log('   📧 contact@techcorp.com | 🔐 password123');
        console.log('   📧 booking@hotelchain.com | 🔐 password123');
        console.log('');
        console.log('🤝 AFFILIATE ACCOUNTS:');
        console.log('   📧 partner@travelagency.com | 🔐 password123');
        console.log('   📧 sales@eventcompany.com | 🔐 password123');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🎫 ACTIVE COUPONS:');
        console.log('   🎉 WELCOME20 - 20% off for new customers');
        console.log('   ☀️ SUMMER25 - 25% off summer special');
        console.log('   💎 PREMIUM10 - $10 off premium rides');
        console.log('   🏢 CORPORATE15 - 15% off for corporate clients');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n📊 SAMPLE DATA CREATED:');
        console.log('   👥 12 Users (2 admin, 3 customer, 3 driver, 2 B2B, 2 affiliate)');
        console.log('   🏢 4 Companies (2 B2B, 2 affiliate)');
        console.log('   🚗 9 Cars across 5 categories');
        console.log('   👨‍✈️ 3 Drivers with car assignments');
        console.log('   🛣️ 10 Route fares (US & European routes)');
        console.log('   📅 7 Bookings (completed, active, pending, cancelled)');
        console.log('   🎫 5 Coupons (4 active, 1 expired)');
        console.log('   💳 5 Payments with various statuses');
        console.log('   ⭐ 4 Reviews and ratings');
        console.log('   📄 5 CMS pages');
        console.log('   ⚙️ 8 System settings');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🚀 Ready to start your ride booking platform!');
        console.log('   📖 API Docs: http://localhost:3000/api/docs');
        console.log('   🔐 Login with any admin account to access the full admin panel');
        console.log('');
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    } finally {
        await appContext.close();
    }
}

bootstrap();