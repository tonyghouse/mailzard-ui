'use client'
  import Link from 'next/link'
  import React from 'react'
  import { UserButton, useUser } from "@clerk/nextjs"

  import { Button } from './ui/button'
import { Mail } from 'lucide-react'

  
export default function Navbar() {
      // const { userId }: { userId: string | null } = auth()
      const { isSignedIn, user } = useUser();

    return (
      <header className="px-4 lg:px-6 h-14 flex items-center">
      <Link className="flex items-end justify-center" href="/">
         <Mail className="h-5 w-5" />
        <div className="ml-1 text-base font-bold">Mailzard</div>
      </Link>
      <nav className="ml-auto flex gap-4 sm:gap-6">
      </nav>
      {
      (isSignedIn) ?  <div className="ml-4 flex gap-2"> <UserButton /> </div>:
      <div className="ml-4 flex gap-2">
        <Link href={"/sign-in"}>
        <Button variant="outline">Sign In</Button>
        </Link>
        
        <Link href={"/sign-up"}>
        <Button variant="secondary">Sign Up</Button>
        </Link>
      </div>
     }
    </header>
    )
  }