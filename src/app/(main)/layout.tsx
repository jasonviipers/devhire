import { Header } from '@/components/global/header';
import { Footer } from '@/components/global/footer';
import { requireUser } from '@/hooks/useRequireUser';
import Hero from '@/components/global/hero';

export default async function JobBoardLayout({ children }: { children: React.ReactNode }) {
    const user = await requireUser()
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <main className="flex-1">
            <Header user={user} />
                <Hero />
                {children}
            <Footer />
            </main>
        </div>
    )
}