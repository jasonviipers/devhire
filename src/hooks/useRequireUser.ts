import "server-only";
import { authServer } from "@/server/auth/auth-server";
import { redirect } from "next/navigation";

export async function requireUser(requiredType?: 'COMPANY' | 'JOB_SEEKER' | 'ADMIN') {
  const { user } = await authServer()

  // Check if user is authenticated
  if (!user?.id) {
    redirect("/login");
  }



  // Check if user type matches the required type (if provided)
  if (user?.userType) {
    if (requiredType && user.userType !== requiredType) {
      throw new Error(`Forbidden: User must be of type ${requiredType}`);
    }
  }
  return user;
}
