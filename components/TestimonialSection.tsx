"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Patient",
    image: "https://i.pravatar.cc/80?u=sarah.johnson",
    rating: 5,
    // CHANGED: Brand name updated
    text: "Schedula made it so easy to find a great doctor. The video consultation was smooth and professional. Highly recommend!",
  },
  // ... other testimonials
]

export function TestimonialSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    // CHANGED: Using theme background color
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-16">
          {/* CHANGED: Using theme text colors */}
          <h2 className="text-4xl font-bold text-foreground mb-4">What Our Patients Say</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {/* CHANGED: Brand name updated */}
            Real experiences from real patients who trust Schedula for their healthcare needs
          </p>
        </div>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  {/* CHANGED: Card uses theme's card color */}
                  <Card className="bg-card shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-8 text-center">
                      {/* CHANGED: Quote icon uses theme's primary color */}
                      <Quote className="w-12 h-12 text-primary mx-auto mb-6" />
                      <p className="text-lg text-muted-foreground mb-8 leading-relaxed italic">
                        "{testimonial.text}"
                      </p>
                      <div className="flex items-center justify-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <div className="flex items-center justify-center space-x-4">
                        <img
                          src={testimonial.image || "/placeholder.svg"}
                          alt={testimonial.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold text-foreground">{testimonial.name}</h4>
                          <p className="text-muted-foreground">{testimonial.role}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                // CHANGED: Indicator dots use theme colors
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-primary w-8" : "bg-muted"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}