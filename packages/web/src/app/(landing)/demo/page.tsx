'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import { Check, ArrowRight } from 'lucide-react';
import { trpc } from '@/utils/trpc';
import { OrangeDAOLogo } from '@/components/orange-dao-logo';

const workEmailProviders = [
  'gmail.com',
  'yahoo.com',
  'hotmail.com',
  'outlook.com',
  'aol.com',
];

const formSchema = z.object({
  userType: z.enum(['freelancer-consultant', 'agency-studio', 'creator']),
  fullName: z.string().min(2, 'Full name must be at least 2 characters.'),
  email: z.string().email('Invalid email address.'),
  country: z.string().min(1, 'Please select a country.'),
});

type FormData = z.infer<typeof formSchema>;

const countryOptions = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Japan',
  'Germany',
  'France',
  'Rest of EU',
  'Rest of the World',
];

export default function DemoPage() {
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      userType: 'freelancer-consultant',
      fullName: '',
      email: '',
      country: '',
    },
  });
  const [submitted, setSubmitted] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<
    FormData['userType']
  >('freelancer-consultant');

  const waitlistMutation = trpc.waitlist.join.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      reset();
    },
    onError: (error) => {
      console.error('Failed to join waitlist:', error);
      alert('There was an error submitting your request. Please try again.');
    },
  });

  const onSubmit = (data: FormData) => {
    waitlistMutation.mutate(data);
  };

  if (submitted) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl p-8 sm:p-12 text-center shadow-2xl">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0040FF] to-[#0040FF]/80 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-4 text-[#0f1e46]">Thank You!</h1>
                      <p className="text-[#5a6b91] mb-8 text-lg">
              You&apos;re on the waitlist. We&apos;ll be in touch at the email you provided.
            </p>
          <Link href="/">
            <Button className="bg-[#0040FF] hover:bg-[#0040FF]/90 text-white px-8 py-3 text-lg rounded-xl shadow-lg shadow-[#0040FF]/25 transition-all hover:scale-[1.02]">
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#eef4ff] to-[#dfe7ff] flex items-center justify-center p-4 sm:p-6">
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-[#0040FF]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-[#0040FF]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#DDE0F2]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto bg-white/90 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-white/40 grid grid-cols-1 lg:grid-cols-2 relative">
        {/* Left side */}
        <div className="p-8 lg:p-12 bg-gradient-to-br from-[#0040FF]/5 to-[#DDE0F2]/20 flex flex-col justify-between">
          <div>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 mb-8">
              <Image
                src="/new-logo-bluer.png"
                alt="Zero Finance"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-semibold text-[#0040FF] tracking-tight">
                finance
              </span>
            </Link>

            <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight text-[#0f1e46] mb-6">
              The first bank account that does its own bookkeeping.
            </h2>
            
            <p className="text-xl text-[#5a6b91] mb-8 leading-relaxed">
              Stop wasting time on financial admin. Let AI handle your invoicing, 
              tax prep, and cash management.
            </p>

            <ul className="space-y-4 mb-8">
              {[
                'Stop wasting 10+ hours a month on financial admin',
                'Automatically sweep idle cash into high-yield vaults',
                'Generate and send invoices without lifting a finger',
                'Automate quarterly tax prep and payments',
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#0040FF]/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-[#0040FF]" />
                  </div>
                  <span className="text-[#5a6b91] text-lg">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="bg-white/70 backdrop-blur-sm p-6 rounded-xl border border-[#0040FF]/10 shadow-sm">
            <p className="text-[#5a6b91] italic mb-4 text-lg leading-relaxed">
              &ldquo;I used to dread the end of every quarter. 0 finance handles my 
              invoicing, puts my cash to work, and gets my taxes ready automatically. 
              It&apos;s a complete game-changer.&rdquo;
            </p>
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0040FF] to-[#0040FF]/80 flex items-center justify-center text-white font-semibold text-lg mr-4">
                A
              </div>
              <div>
                <p className="font-semibold text-[#0f1e46]">Alex Carter</p>
                <p className="text-[#5a6b91] text-sm">Design Consultant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side (Form) */}
        <div className="p-8 lg:p-12 bg-white">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3 text-[#0f1e46]">
              Get Early Access
            </h2>
            <p className="text-[#5a6b91] text-lg">
              Join ~200 freelancers on the waitlist.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label className="text-base font-semibold text-[#0f1e46] mb-3 block">
                What best describes you?*
              </Label>
              <Controller
                name="userType"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-2 bg-[#DDE0F2]/20 rounded-xl">
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange('freelancer-consultant');
                        setSelectedUserType('freelancer-consultant');
                      }}
                      className={cn(
                        'px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-center',
                        selectedUserType === 'freelancer-consultant'
                          ? 'bg-[#0040FF] text-white shadow-lg shadow-[#0040FF]/25'
                          : 'text-[#5a6b91] hover:bg-white/80 hover:text-[#0f1e46]',
                      )}
                    >
                      Consultant
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange('agency-studio');
                        setSelectedUserType('agency-studio');
                      }}
                      className={cn(
                        'px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-center',
                        selectedUserType === 'agency-studio'
                          ? 'bg-[#0040FF] text-white shadow-lg shadow-[#0040FF]/25'
                          : 'text-[#5a6b91] hover:bg-white/80 hover:text-[#0f1e46]',
                      )}
                    >
                      Agency / Studio
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange('creator');
                        setSelectedUserType('creator');
                      }}
                      className={cn(
                        'px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-center',
                        selectedUserType === 'creator'
                          ? 'bg-[#0040FF] text-white shadow-lg shadow-[#0040FF]/25'
                          : 'text-[#5a6b91] hover:bg-white/80 hover:text-[#0f1e46]',
                      )}
                    >
                      Creator
                    </button>
                  </div>
                )}
              />
            </div>

            <div>
              <Label
                htmlFor="fullName"
                className="text-base font-semibold text-[#0f1e46] mb-2 block"
              >
                Full name*
              </Label>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <Input
                    id="fullName"
                    {...field}
                    className="bg-[#DDE0F2]/10 border-[#DDE0F2]/50 text-[#0f1e46] placeholder-[#5a6b91] focus:ring-[#0040FF] focus:border-[#0040FF] text-base py-3 px-4 rounded-lg"
                    placeholder="Enter your full name"
                  />
                )}
              />
              {errors.fullName && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="email"
                className="text-base font-semibold text-[#0f1e46] mb-2 block"
              >
                Work email*
              </Label>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    id="email"
                    type="email"
                    {...field}
                    className="bg-[#DDE0F2]/10 border-[#DDE0F2]/50 text-[#0f1e46] placeholder-[#5a6b91] focus:ring-[#0040FF] focus:border-[#0040FF] text-base py-3 px-4 rounded-lg"
                    placeholder="your@company.com"
                  />
                )}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="country"
                className="text-base font-semibold text-[#0f1e46] mb-2 block"
              >
                Country*
              </Label>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger
                      id="country"
                      className="w-full bg-[#DDE0F2]/10 border-[#DDE0F2]/50 text-[#0f1e46] focus:ring-[#0040FF] focus:border-[#0040FF] text-base py-3 px-4 rounded-lg"
                    >
                      <SelectValue placeholder="Select your country..." />
                    </SelectTrigger>
                    <SelectContent className="bg-white text-[#0f1e46] border-[#DDE0F2]/50">
                      {countryOptions.map((country) => (
                        <SelectItem
                          key={country}
                          value={country}
                          className="focus:bg-[#DDE0F2]/20 focus:text-[#0f1e46]"
                        >
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="mt-2 text-sm text-red-500">
                  {errors.country.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={waitlistMutation.isPending}
              className="w-full bg-[#0040FF] hover:bg-[#0040FF]/90 text-white font-semibold py-4 px-8 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#0040FF]/25 disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
            >
              {waitlistMutation.isPending ? (
                'Submitting...'
              ) : (
                <>
                  Request Access
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </Button>
          </form>

          {/* Backed by Orange DAO */}
          <div className="mt-8 pt-8 border-t border-[#DDE0F2]/30">
            <p className="text-xs text-[#5a6b91] mb-3 uppercase tracking-wider text-center">Backed by</p>
            <a 
              href="https://www.orangedao.xyz/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex justify-center opacity-70 hover:opacity-100 transition-opacity"
            >
              <OrangeDAOLogo className="h-8 w-auto" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
