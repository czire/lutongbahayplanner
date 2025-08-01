"use client";

import Header from "@/components/Header";
import SignInFacebook from "@/components/ui/session-buttons/SigninFacebook";
import SignInGoogle from "@/components/ui/session-buttons/SigninGoogle";
import DebouncedLink from "@/components/ui/DebouncedLink";
import { landingPageData } from "@/lib/data/landing-page";
import { createGuestSession } from "@/lib/utils/guest-session";

export default function Home() {
  const { hero, features, cta } = landingPageData;

  return (
    <main className="min-h-screen bg-gradient-to-br from-background to-orange-50">
      <Header />

      <div className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Hero Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h1 className="font-bold text-primary leading-tight">
              {hero.title}
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              {hero.subtitle}
            </p>

            <ul className="space-y-3 text-left max-w-md mx-auto lg:mx-0">
              {features.map((feature) => (
                <li key={feature.id} className="flex items-start gap-3">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <span>{feature.text}</span>
                </li>
              ))}
            </ul>

            <div className="pt-4">
              <DebouncedLink
                href={hero.ctaLink}
                variant="default"
                size="lg"
                className="w-full sm:w-auto"
                hoverStyle="action"
              >
                {hero.ctaText}
              </DebouncedLink>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-card border border-border rounded-xl p-8 shadow-lg space-y-6">
            <div className="text-center space-y-4">
              <h2 className="font-bold text-primary">{cta.title}</h2>
              <p className="text-muted-foreground">{cta.description}</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3 flex-center flex-col">
                <SignInGoogle />
                <SignInFacebook />
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <DebouncedLink
                href={cta.guestCta.link}
                variant="outline"
                className="w-full"
                hoverStyle="secondary"
                onClick={() => {
                  createGuestSession();
                }}
              >
                {cta.guestCta.text}
              </DebouncedLink>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              {cta.guestNote}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
