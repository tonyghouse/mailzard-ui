import Link from "next/link"
import { ArrowLeft, Mail, PlaneIcon as PaperPlane } from 'lucide-react'
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-white bg-[linear-gradient(#e6e6e6_1px,transparent_1px),linear-gradient(90deg,#e6e6e6_1px,transparent_1px)] bg-[size:20px_20px]">
      <div className="container px-4 md:px-6 flex flex-col items-center text-center max-w-3xl">
        <div className="relative w-full">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <PaperPlane className="h-8 w-8 mr-2" />
            <span className="text-2xl font-mono tracking-tight">Mailzard</span>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute left-10 top-20 transform -rotate-12">
            <PaperPlane className="h-12 w-12 text-gray-300" />
          </div>
          <div className="absolute right-20 top-10">
            <Mail className="h-10 w-10 text-gray-300" />
          </div>
          <div className="absolute left-1/4 bottom-0">
            <div className="w-8 h-8 border-2 border-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-300 text-xs">404</span>
            </div>
          </div>
          <div className="absolute right-1/4 bottom-20">
            <div className="text-gray-300 transform rotate-12 text-sm font-mono">{'<mail/>'}</div>
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl font-mono tracking-tight mt-12 mb-4">
          Oops!
        </h1>
        
        <h2 className="text-4xl md:text-5xl font-mono tracking-tight mb-8">
          Page not found.
        </h2>
        
        <p className="text-xl md:text-2xl text-gray-600 mb-12">
          Your message seems to have gotten lost in transit.
        </p>
        
        <Link href="/">
          <Button 
            variant="outline" 
            size="lg" 
            className="border-2 rounded-md px-6 py-3 font-mono text-lg flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}
