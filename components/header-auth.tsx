import { signOutAction } from "@/app/actions";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Link from "next/link";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("ヘッダー作成");
  console.log(user);

  // if (!hasEnvVars) {
  //   return (
  //     <>
  //       <div className="flex gap-4 items-center">
  //         <div>
  //           <Badge
  //             variant={"default"}
  //             className="font-normal pointer-events-none"
  //           >
  //             Please update .env.local file with anon key and url
  //           </Badge>
  //         </div>
  //         <div className="flex gap-2">
  //           <Button
  //             asChild
  //             size="sm"
  //             variant={"outline"}
  //             disabled
  //             className="opacity-75 cursor-none pointer-events-none"
  //           >
  //             <Link href="/sign-in">Sign in</Link>
  //           </Button>
  //           <Button
  //             asChild
  //             size="sm"
  //             variant={"default"}
  //             disabled
  //             className="opacity-75 cursor-none pointer-events-none"
  //           >
  //             <Link href="/sign-up">Sign up</Link>
  //           </Button>
  //         </div>
  //       </div>
  //     </>
  //   );
  // }
  return user ? (
    <div className="flex justify-end items-center gap-4 w-full p-4">
      <div> {user.user_metadata.department_name}</div>
      <div> {user.user_metadata.user_name}</div>
     
      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out
        </Button>
      </form>
    </div>
  ) : (
    <div className="flex gap-2">
      {/* <Button asChild size="sm" variant={"outline"}>
        <Link href="/sign-in">Sign in</Link>
      </Button>
      <Button asChild size="sm" variant={"default"}>
        <Link href="/sign-up">Sign up</Link>
      </Button> */}
    </div>
  );
}
