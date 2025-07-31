"use client"

import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function ModernFooter() {
  return (
    // CHANGED: Using theme variables for background and text.
    <footer className="bg-muted/40 text-foreground">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              {/* CHANGED: Logo uses theme's primary color. */}
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-primary-foreground" />
              </div>
              {/* CHANGED: Project name updated and uses theme's primary color. */}
              <span className="text-2xl font-bold text-primary">
                Schedula
              </span>
            </div>
            {/* CHANGED: Text uses muted-foreground theme color. */}
            <p className="text-muted-foreground leading-relaxed">
              Your trusted healthcare companion. Connect with qualified doctors, book appointments, and take control of
              your health journey.
            </p>
            <div className="flex space-x-2">
              {/* IMPROVEMENT: Buttons now use default variants which are theme-aware. */}
              <Button size="icon" variant="ghost">
                <Facebook className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Instagram className="w-5 h-5" />
              </Button>
              <Button size="icon" variant="ghost">
                <Linkedin className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links, For Patients, For Doctors */}
          {/* ... (link sections are similar) ... */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              {/* CHANGED: Links now use theme-aware colors. */}
              <Link href="/" className="block text-muted-foreground hover:text-primary transition-colors">
                Home
              </Link>
              <Link href="/find-doctors" className="block text-muted-foreground hover:text-primary transition-colors">
                Find Doctors
              </Link>
              {/* ... other links similarly ... */}
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Patients</h3>
            <div className="space-y-2">
              <Link href="/find-doctors" className="block text-muted-foreground hover:text-primary transition-colors">
                Search Doctors
              </Link>
              <Link href="/appointments" className="block text-muted-foreground hover:text-primary transition-colors">
                My Appointments
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">For Doctors</h3>
            <div className="space-y-2">
              <Link href="/doctor/dashboard" className="block text-muted-foreground hover:text-primary transition-colors">
                Doctor Dashboard
              </Link>
              <Link href="/auth" className="block text-muted-foreground hover:text-primary transition-colors">
                Join as Doctor
              </Link>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="border-t mt-12 pt-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-3">
              <Mail className="w-5 h-5 text-primary" />
              {/* CHANGED: Email updated to new brand name */}
              <span className="text-muted-foreground">support@schedula.com</span>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">+1 (555) 123-4567</span>
            </div>
            <div className="flex items-center space-x-3">
              <MapPin className="w-5 h-5 text-primary" />
              <span className="text-muted-foreground">123 Healthcare St, Medical City</span>
            </div>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div>
              <h3 className="text-lg font-semibold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground">Subscribe to get health tips and updates</p>
            </div>
            <div className="flex space-x-2 w-full md:w-auto">
              <Input
                placeholder="Enter your email"
                className="md:w-64"
              />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-8 text-center">
          {/* CHANGED: Copyright updated to new brand name */}
          <p className="text-muted-foreground">© {new Date().getFullYear()} Schedula. All rights reserved. | Privacy Policy | Terms of Service</p>
        </div>
      </div>
    </footer>
  )
}