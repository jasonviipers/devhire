import {env} from '@/env';
import {createAuthClient} from 'better-auth/client';
import { toast } from "sonner"

export const useAuthClient = () => {
    const auth = createAuthClient({
        baseURL: env.NEXT_PUBLIC_URL,
        fetchOptions: {
            onError(e) {
                if (e.error.status === 429) {
                    toast("Too many requests Please try again later")
                }
            }
        },
    });
    return auth;
};
