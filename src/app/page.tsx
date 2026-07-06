import { redirect } from "next/navigation";

   export default function RootPage() {
     // Automatically redirects users to the sign-in flow
     redirect("/auth/signin");
   }