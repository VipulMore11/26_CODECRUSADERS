"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, Activity, Beaker, FileText, Stethoscope } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: "/trials", label: "Browse Trials", icon: Beaker },
    { href: "/dashboard", label: "Upload Records", icon: FileText },
    { href: "/analyze", label: "Procedure Analysis", icon: Stethoscope },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-8 lg:px-10">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary">
              <Activity className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold tracking-tight">
              TrialMatch<span className="text-primary">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 rounded-xl px-5 py-3 text-lg font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground hover:scale-105 transform transition-transform"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" size="lg" className="text-lg font-semibold px-6">
              Sign In
            </Button>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-lg font-bold px-8 py-6 rounded-xl shadow-lg transition-all">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-xl p-3 text-muted-foreground hover:bg-secondary md:hidden"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="space-y-2 px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 rounded-xl px-4 py-3 text-lg font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <Button variant="ghost" size="lg" className="w-full text-lg">
                Sign In
              </Button>
              <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-lg py-7 rounded-xl">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
