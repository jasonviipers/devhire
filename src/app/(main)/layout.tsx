import { Header } from '@/components/global/header';
import { Footer } from '@/components/global/footer';
import Hero from '@/components/global/hero';
import { requireUser } from '@/hooks/useRequireUser';

export default async function MainLayout({ children }: { children: React.ReactNode }) {
    const user = await requireUser()
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
            <Header user={user} />
                {children}
        </div>
    )
}