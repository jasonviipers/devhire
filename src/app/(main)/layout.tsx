import { Header } from '@/components/global/header';
import { Footer } from '@/components/global/footer';
import Hero from '@/components/global/hero';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 flex flex-col">
                <Hero />
                {children}
            </main>
            <Footer />
        </div>
    )
}