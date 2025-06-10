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
import { Check } from 'lucide-react';
import { trpc } from '@/utils/trpc';

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
  email: z
    .string()
    .email('Invalid email address.')
    .refine(
      (email) => {
        const domain = email.split('@')[1];
        if (!domain) return false;
        return !workEmailProviders.includes(domain.toLowerCase());
      },
      { message: 'Please use your work email.' },
    ),
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
    resolver: zodResolver(formSchema),
    defaultValues: {
      userType: 'freelancer-consultant',
      fullName: '',
      email: '',
      country: '',
    },
  });
  const [submitted, setSubmitted] = useState(false);
  const [selectedUserType, setSelectedUserType] =
    useState<FormData['userType']>('freelancer-consultant');

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
      <div className="min-h-screen w-full flex flex-col items-center justify-center text-neutral-800 relative overflow-hidden bg-gradient-to-br from-blue-50 via-purple-50 to-green-50 p-6">
        <div className="max-w-md w-full bg-white/80 backdrop-blur-sm border border-white/40 rounded-3xl p-8 sm:p-12 text-center shadow-2xl">
          <h1 className="text-3xl font-bold mb-4">Thank You!</h1>
          <p className="text-neutral-600 mb-6">
            You are on the waitlist. We&apos;ll be in touch at the email you
            provided.
          </p>
          <Link href="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center text-neutral-800 relative overflow-hidden p-4 sm:p-6">
      {/* Gradient Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-green-50"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-l from-blue-400/20 to-green-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-green-300/10 via-blue-300/10 to-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      <div className="w-full max-w-lg mx-auto bg-black rounded-2xl shadow-2xl overflow-hidden md:max-w-4xl md:grid md:grid-cols-2">
        {/* Left side */}
        <div className="p-8 text-white bg-neutral-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <Link
                href="/"
                className="flex items-center text-lg tracking-tight text-white hover:opacity-80 transition-opacity"
              >
                <div className="h-8 px-2 rounded-md bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300 flex items-center justify-center text-black font-bold shadow-lg border border-neutral-800/20">
                  zero
                </div>
                <span className="ml-1 font-semibold">finance</span>
              </Link>
            </div>
            <h2 className="text-3xl font-bold mt-8 leading-tight">
              The first bank account that does its own bookkeeping.
            </h2>
            <ul className="space-y-3 mt-6 text-neutral-300">
              {[
                'Stop wasting 10+ hours a month on financial admin.',
                'Automatically sweep idle cash into high-yield vaults.',
                'Generate and send invoices without lifting a finger.',
                'Automate quarterly tax prep and payments.',
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <Check className="w-4 h-4 text-green-400 mr-3 mt-1 flex-shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-8 bg-neutral-800/50 p-4 rounded-lg border border-neutral-700">
            <p className="text-sm italic">
              &ldquo;I used to dread the end of every quarter. Zero Finance
              handles my invoicing, puts my cash to work, and gets my taxes
              ready automatically. It&apos;s a complete
              game-changer.&rdquo;
            </p>
            <div className="flex items-center mt-4">
              {/* <div className="w-10 h-10 rounded-full bg-neutral-700 mr-3"></div> */}
              <div>
                <p className="font-semibold text-sm">Alex Carter</p>
                <p className="text-xs text-neutral-400">Design Consultant</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side (Form) */}
        <div className="p-8 bg-neutral-800">
          <h2 className="text-xl font-semibold mb-6 text-white">
            Get Early Access
          </h2>
          <p className="text-sm text-neutral-400 mb-6 -mt-4">
            Join ~200 freelancers on the waitlist.
          </p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-neutral-400">
                What best describes you?*
              </Label>
              <Controller
                name="userType"
                control={control}
                render={({ field }) => (
                  <div className="grid grid-cols-3 gap-2 mt-2 rounded-md bg-neutral-700 p-1">
                    <button
                      type="button"
                      onClick={() => {
                        field.onChange('freelancer-consultant');
                        setSelectedUserType('freelancer-consultant');
                      }}
                      className={cn(
                        'px-3 py-1.5 text-sm font-medium rounded transition-colors text-center',
                        selectedUserType === 'freelancer-consultant'
                          ? 'bg-white text-black'
                          : 'text-neutral-300 hover:bg-neutral-600',
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
                        'px-3 py-1.5 text-sm font-medium rounded transition-colors text-center',
                        selectedUserType === 'agency-studio'
                          ? 'bg-white text-black'
                          : 'text-neutral-300 hover:bg-neutral-600',
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
                        'px-3 py-1.5 text-sm font-medium rounded transition-colors text-center',
                        selectedUserType === 'creator'
                          ? 'bg-white text-black'
                          : 'text-neutral-300 hover:bg-neutral-600',
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
                className="text-sm font-medium text-neutral-400"
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
                    className="mt-1 bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:ring-green-500 focus:border-green-500"
                  />
                )}
              />
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="email"
                className="text-sm font-medium text-neutral-400"
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
                    className="mt-1 bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:ring-green-500 focus:border-green-500"
                  />
                )}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label
                htmlFor="country"
                className="text-sm font-medium text-neutral-400"
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
                      className="w-full mt-1 bg-neutral-700 border-neutral-600 text-white"
                    >
                      <SelectValue placeholder="Select one..." />
                    </SelectTrigger>
                    <SelectContent className="bg-neutral-800 text-white border-neutral-600">
                      {countryOptions.map((country) => (
                        <SelectItem
                          key={country}
                          value={country}
                          className="focus:bg-neutral-700"
                        >
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.country && (
                <p className="mt-1 text-xs text-red-500">
                  {errors.country.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={waitlistMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
            >
              {waitlistMutation.isPending ? 'Submitting...' : 'Request Access'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
} 