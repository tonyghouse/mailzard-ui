"use client"

import Link from "next/link"
import { Mail, Zap, BarChart, Clock, Settings, Users, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ReactNode, useEffect } from "react"
import { useUser } from "@clerk/nextjs";

import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar"




export default function Home() {
    const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) router.replace("/dashboard");
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return <div className="h-screen w-full bg-background" />;
  if (isSignedIn) return null;
  return (
    <div className="min-h-screen bg-background">
      <Navbar/>
      {/* HERO */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Column */}
            <div>
              <div className="inline-block border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-medium uppercase tracking-wide text-primary mb-6">
                Production-Ready Email Infrastructure
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight text-foreground leading-tight mb-6">
                Bring your emails to life
              </h1>

              <p className="text-lg text-muted-foreground mb-8 leading-relaxed max-w-xl">
                Powerful transactional and marketing email automation built for modern teams who demand reliability.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <Button size="lg" className="h-12 px-8">
                  Start automating
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="h-12 px-8"
                >
                  View demo
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border">
                <StatBox number="99.9%" label="Uptime" />
                <StatBox number="<100ms" label="Latency" />
                <StatBox number="10000+" label="Daily emails" />
              </div>
            </div>

            {/* Right Column */}
            <div className="relative">
              <div className="border border-border bg-card p-8">
                {/* Code Preview */}
                <div className="border border-border bg-muted/30 p-6 mb-6">
                  <div className="flex items-center gap-2 mb-4 pb-4 border-b border-border">
                    <div className="h-2 w-2 bg-red-500"></div>
                    <div className="h-2 w-2 bg-yellow-500"></div>
                    <div className="h-2 w-2 bg-green-500"></div>
                    <span className="ml-auto text-xs font-mono text-muted-foreground">SendEmail.java</span>
                  </div>
                  <div className="font-mono text-sm space-y-1.5 text-muted-foreground">
                    <div>
                       mailzard.<span className="text-blue-600">send</span>({"{"}
                    </div>
                    <div className="pl-4">
                      to: <span className="text-green-600">&quot;user@example.com&quot;</span>,
                    </div>
                    <div className="pl-4">
                      subject: <span className="text-green-600">&quot;Welcome!&quot;</span>,
                    </div>
                    <div className="pl-4">
                      template: <span className="text-green-600">&quot;onboarding&quot;</span>
                    </div>
                    <div>{"});"}</div>
                  </div>
                </div>

                {/* Features */}
                <div className="space-y-3">
                  <FeatureCheck text="Zero configuration required" />
                  <FeatureCheck text="RESTful API & SDK support" />
                  <FeatureCheck text="Real-time delivery tracking" />
                  <FeatureCheck text="Template engine included" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-24">
          <div className="mb-16 max-w-2xl">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
              Features
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Everything you need to send emails at scale
            </h2>
            <p className="text-muted-foreground">
              From transactional messages to large marketing campaigns — Mailzard handles it all.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Feature 
              icon={<Zap className="h-5 w-5" />} 
              title="Instant delivery" 
              description="Send thousands of emails with low latency and high reliability."
            />
            <Feature 
              icon={<Settings className="h-5 w-5" />} 
              title="Easy integration" 
              description="Drop-in APIs and SDKs that fit directly into your stack."
            />
            <Feature 
              icon={<Clock className="h-5 w-5" />} 
              title="Scheduled campaigns" 
              description="Plan, queue, and automate campaigns with precision timing."
            />
            <Feature 
              icon={<BarChart className="h-5 w-5" />} 
              title="Detailed analytics" 
              description="Track opens, clicks, and delivery metrics in real time."
            />
            <Feature 
              icon={<Users className="h-5 w-5" />} 
              title="Audience segmentation" 
              description="Send the right message to the right users at the right time."
            />
            <Feature 
              icon={<Mail className="h-5 w-5" />} 
              title="Transactional emails" 
              description="Password resets, OTPs, receipts, and system notifications."
            />
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-24">
          <div className="mb-16">
            <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground mb-4">
              Process
            </div>
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground">
              How Mailzard works
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <Step 
              step="01" 
              title="Connect" 
              description="Integrate Mailzard with your backend and import contacts seamlessly."
            />
            <Step 
              step="02" 
              title="Create" 
              description="Design emails using our templates or bring your own HTML."
            />
            <Step 
              step="03" 
              title="Automate" 
              description="Set triggers and workflows to send emails automatically."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-border">
        <div className="container mx-auto px-6 py-24">
          <div className="border border-border bg-card p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-4">
              Ready to ship emails faster?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Join thousands of developers who trust Mailzard for their email infrastructure.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <Button size="lg" className="h-12 px-8">
                Get started for free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Free tier available</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background">
        <div className="container mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-border pt-8">
            <div className="text-lg font-semibold tracking-tight">MAILZARD</div>
            <div className="text-sm text-muted-foreground">
              Crafted with ❤️ by Tony Ghouse & Team
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ---------- components ---------- */

function StatBox({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-2xl font-semibold text-foreground mb-1">{number}</div>
      <div className="text-xs text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  )
}

function Feature({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="border border-border bg-card p-6 hover:border-primary/50 transition-colors">
      <div className="mb-4 text-primary">
        {icon}
      </div>
      <h3 className="mb-2 font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function Step({ step, title, description }: { step: string; title: string; description: string }) {
  return (
    <div className="border border-border bg-card p-8">
      <div className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wide">
        Step {step}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
    </div>
  )
}

function FeatureCheck({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3">
      <Check className="h-4 w-4 text-primary flex-shrink-0" />
      <span className="text-sm text-muted-foreground">{text}</span>
    </div>
  )
}