import Link from "next/link"
import { Mail, Zap, BarChart, Clock, Settings, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReactNode } from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem]">
      <header className="container mx-auto flex h-20 items-center justify-between px-4">
        <div className="flex items-center space-x-2">
          <Mail className="h-6 w-6" />
          <span className="text-xl font-medium">Mailzard</span>
        </div>
        <nav className="hidden space-x-8 md:flex">
          <Link href="#features" className="text-gray-600 hover:text-gray-900">
            Features
          </Link>
          <Link href="#templates" className="text-gray-600 hover:text-gray-900">
            Templates
          </Link>
          <Link href="#pricing" className="text-gray-600 hover:text-gray-900">
            Pricing
          </Link>
          <Link href="#docs" className="text-gray-600 hover:text-gray-900">
            Docs
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Log In
          </Link>
          <Button>Sign Up</Button>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="relative mx-auto max-w-4xl">
            {/* Decorative elements */}
            <div className="absolute -left-16 top-0 md:-left-24">
              <Mail className="h-12 w-12 rotate-12 text-gray-300" />
            </div>
            <div className="absolute -right-8 top-24 md:-right-16">
              <Zap className="h-10 w-10 -rotate-12 text-gray-300" />
            </div>
            <div className="absolute bottom-0 left-16 md:left-24">
              <BarChart className="h-8 w-8 rotate-6 text-gray-300" />
            </div>

            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl">Bring your emails to life.</h1>
            <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-600">
              Your email needs are unique—your email automation tools should be too.
            </p>
            <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
              <Button size="lg" className="px-8">
                Start Automating
              </Button>
              <Button size="lg" variant="outline" className="px-8">
                View Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="container mx-auto px-4 py-24">
          <h2 className="mb-12 text-center text-3xl font-bold md:text-4xl">Marketing and Transactional Emails, Simplified.</h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<Zap className="h-8 w-8" />}
              title="Instant Delivery"
              description="Send thousands of emails instantly with our high-performance infrastructure."
            />
            <FeatureCard
              icon={<Settings className="h-8 w-8" />}
              title="Easy Integration"
              description="Connect with your favorite tools and platforms with just a few clicks."
            />
            <FeatureCard
              icon={<Clock className="h-8 w-8" />}
              title="Scheduled Campaigns"
              description="Plan and schedule your marketing campaigns in advance."
            />
            <FeatureCard
              icon={<BarChart className="h-8 w-8" />}
              title="Detailed Analytics"
              description="Track open rates, clicks, and conversions with comprehensive analytics."
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Audience Segmentation"
              description="Target specific customer segments for personalized messaging."
            />
            <FeatureCard
              icon={<Mail className="h-8 w-8" />}
              title="Transactional Emails"
              description="Automate order confirmations, password resets, and other critical communications."
            />
          </div>
        </section>

        {/* How It Works Section */}
        <section className="container mx-auto px-4 py-24">
          <h2 className="mb-16 text-center text-3xl font-bold md:text-4xl">How Mailzard works</h2>
          <div className="relative mx-auto grid max-w-4xl gap-12 md:grid-cols-3">
            {/* Connecting line */}
            <div className="absolute left-1/2 top-12 hidden h-[calc(100%-6rem)] w-0.5 -translate-x-1/2 bg-gray-200 md:block"></div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Connect</h3>
              <p className="text-gray-600">Integrate Mailzard with your existing systems and import your contacts.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Create</h3>
              <p className="text-gray-600">Design beautiful emails or choose from our template library.</p>
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="mb-2 text-xl font-semibold">Automate</h3>
              <p className="text-gray-600">Set up triggers and workflows to send emails automatically.</p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container mx-auto px-4 py-24 text-center">
          <div className="mx-auto max-w-3xl rounded-2xl bg-primary/5 p-12">
            <h2 className="mb-6 text-3xl font-bold md:text-4xl">Ready to transform your email strategy?</h2>
            <p className="mx-auto mb-8 max-w-xl text-lg text-gray-600">
              Join thousands of businesses that use Mailzard to automate their transactional and marketing emails.
            </p>
            <Button size="lg" className="px-8">
              Get Started for Free
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span className="text-lg font-medium">Mailzard</span>
              </div>
              <p className="mt-4 text-sm text-gray-600">Automating email delivery for businesses of all sizes.</p>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Templates
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Integrations
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Resources</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Documentation
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    API Reference
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-500">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#" className="text-gray-600 hover:text-gray-900">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
            {/* <p>© {new Date().getFullYear()} Mailzard. All rights reserved.</p> */}
              <div>Crafted with ❤️ in UAE 🇦🇪 by Tony Ghouse&apos;s team</div>
          </div>
        </div>
      
      </footer>
    </div>
  )
}

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description } : FeatureCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
