'use client';

import React, { useState, useEffect, useRef } from 'react';
import { signOutAction } from "@/app/actions";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from './contexts/AuthContext';
// import { createClient } from "@/utils/supabase/server";


export default async function HeaderTest() {

  const { user } = useAuth();
  return user ? (
    <div className="flex items-center gap-4">
      <div className="text-sm font-medium text-gray-900">
        {user.department_name}
      </div>
      <div className="text-sm font-medium text-gray-900">
        {user.email}
      </div>

      <form action={signOutAction}>
        <Button type="submit" variant={"outline"}>
          Sign out2
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
