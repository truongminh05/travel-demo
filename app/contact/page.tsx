"use client";

import type React from "react";

import { useState } from "react";
import {
  MapPinIcon,
  PhoneIcon,
  MailIcon,
  ClockIcon,
  SendIcon,
  MessageSquareIcon,
  HeadphonesIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import Link from "next/link"; // Import Link
import { useAuth } from "@/hooks/useAuth";

export default function ContactPage() {
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    inquiryType: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitted(true);
    setIsLoading(false);
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Phone",
      details: ["1-800-TRAVEL", "(1-800-872-8351)"],
      description: "Mon-Fri 8AM-8PM EST, Sat-Sun 9AM-6PM EST",
    },
    {
      icon: MailIcon,
      title: "Email",
      details: ["info@traveldom.com", "bookings@traveldom.com"],
      description: "We respond within 24 hours",
    },
    {
      icon: MapPinIcon,
      title: "Office",
      details: ["123 Adventure Lane", "Denver, CO 80202"],
      description: "Visit us by appointment",
    },
    {
      icon: ClockIcon,
      title: "Hours",
      details: ["Mon-Fri: 8AM-8PM EST", "Weekends: 9AM-6PM EST"],
      description: "Emergency support available 24/7",
    },
  ];

  const faqs = [
    {
      question: "How far in advance should I book?",
      answer:
        "We recommend booking 2-4 weeks in advance for popular tours, especially during peak seasons.",
    },
    {
      question: "What's your cancellation policy?",
      answer:
        "Free cancellation up to 24 hours before departure. 50% refund for cancellations 24-48 hours prior.",
    },
    {
      question: "Do you offer group discounts?",
      answer:
        "Yes! Groups of 8+ receive a 10% discount. Contact us for custom group packages.",
    },
    {
      question: "Are your tours suitable for all ages?",
      answer:
        "Most tours welcome all ages, but some have minimum age requirements. Check individual tour details.",
    },
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <SiteHeader />
        <main className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <SendIcon className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">
              Message Sent!
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for contacting us. We'll get back to you within 24
              hours.
            </p>
            <Button onClick={() => setIsSubmitted(false)}>
              Send Another Message
            </Button>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      <main>
        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Have questions about our tours? Need help planning your next
              adventure? We're here to help make your travel dreams come true.
            </p>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
              {contactInfo.map((info, index) => (
                <Card
                  key={index}
                  className="text-center p-6 hover:shadow-lg transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <info.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-3">{info.title}</h3>
                    <div className="space-y-1 mb-2">
                      {info.details.map((detail, idx) => (
                        <p key={idx} className="font-medium">
                          {detail}
                        </p>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-sm">
                      {info.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section className="py-16 bg-accent/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Form */}
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquareIcon className="w-5 h-5" />
                      Send us a Message
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {isAuthenticated ? (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="name">Full Name *</Label>
                            <Input
                              id="name"
                              value={formData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                              id="email"
                              type="email"
                              value={formData.email}
                              onChange={(e) =>
                                handleInputChange("email", e.target.value)
                              }
                              required
                            />
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                              id="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) =>
                                handleInputChange("phone", e.target.value)
                              }
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="inquiryType">Inquiry Type</Label>
                            <Select
                              onValueChange={(value) =>
                                handleInputChange("inquiryType", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select inquiry type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="general">
                                  General Question
                                </SelectItem>
                                <SelectItem value="booking">
                                  Booking Inquiry
                                </SelectItem>
                                <SelectItem value="support">
                                  Customer Support
                                </SelectItem>
                                <SelectItem value="group">
                                  Group Booking
                                </SelectItem>
                                <SelectItem value="partnership">
                                  Partnership
                                </SelectItem>
                                <SelectItem value="feedback">
                                  Feedback
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subject">Subject *</Label>
                          <Input
                            id="subject"
                            value={formData.subject}
                            onChange={(e) =>
                              handleInputChange("subject", e.target.value)
                            }
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            value={formData.message}
                            onChange={(e) =>
                              handleInputChange("message", e.target.value)
                            }
                            rows={6}
                            placeholder="Tell us how we can help you..."
                            required
                          />
                        </div>

                        <Button
                          type="submit"
                          className="w-full"
                          disabled={isLoading}
                        >
                          {isLoading ? "Đang gửi..." : "Gửi tin nhắn"}
                        </Button>
                      </form>
                    ) : (
                      <div className="text-center p-8 space-y-4">
                        <h3 className="font-semibold text-lg">
                          Đăng nhập để gửi tin nhắn
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          Để nhận được sự hỗ trợ tốt nhất, vui lòng đăng nhập
                          vào tài khoản của bạn.
                        </p>
                        <Button asChild>
                          <Link href="/login?redirect=/contact">
                            Đi đến trang đăng nhập
                          </Link>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Map & Additional Info */}
              <div className="space-y-8">
                {/* Map Placeholder */}
                <Card>
                  <CardHeader>
                    <CardTitle>Visit Our Office</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <MapPinIcon className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Interactive Map</p>
                        <p className="text-sm text-muted-foreground">
                          123 Adventure Lane, Denver, CO 80202
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <strong>Parking:</strong> Free parking available in our
                        building
                      </p>
                      <p>
                        <strong>Public Transit:</strong> Light rail accessible
                        (Union Station)
                      </p>
                      <p>
                        <strong>Appointments:</strong> Walk-ins welcome,
                        appointments preferred
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Emergency Contact */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <HeadphonesIcon className="w-5 h-5" />
                      24/7 Emergency Support
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      If you're currently on a tour and need immediate
                      assistance:
                    </p>
                    <div className="space-y-2">
                      <p className="font-semibold">
                        Emergency Hotline: 1-800-HELP-NOW
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Available 24/7 for tour participants
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Frequently Asked Questions
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Quick answers to common questions. Can't find what you're
                looking for? Send us a message!
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-3">{faq.question}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
