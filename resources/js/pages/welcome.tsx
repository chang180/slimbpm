import Navigation from '@/components/welcome/Navigation';
import Hero from '@/components/welcome/Hero';
import InteractiveDemo from '@/components/welcome/InteractiveDemo';
import Features from '@/components/welcome/Features';
import HowItWorks from '@/components/welcome/HowItWorks';
import CTA from '@/components/welcome/CTA';
import Footer from '@/components/welcome/Footer';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <Navigation />
            <Hero />
            <InteractiveDemo />
            <Features />
            <HowItWorks />
            <CTA />
            <Footer />
        </div>
    );
}