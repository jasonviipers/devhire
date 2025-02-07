'use server';
import { prisma } from "../db";
    // const user = await getUser(session.user.id);

    // // Check if user type matches the required type (if provided)
    // if (user?.userType) {
    //     if (requiredType && user.userType !== requiredType) {
    //         // throw new Error(`Forbidden: User must be of type ${requiredType}`);
    //         console.log(`User must be of type ${requiredType}`);
    //     }
    // }

    // return user;


export async function getUser(userId: string) {
    return await prisma.user.findUnique({
        where: {
            id: userId
        }
    });
}