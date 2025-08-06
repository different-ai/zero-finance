'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePrivy } from '@privy-io/react-auth'
import { api } from '@/trpc/react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

export function InviteHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { ready, authenticated } = usePrivy()
  const [isProcessing, setIsProcessing] = useState(false)
  
  const inviteToken = searchParams.get('invite')
  
  const joinCompany = api.company.joinViaInvite.useMutation({
    onSuccess: (data) => {
      if (data.company) {
        toast.success(`🎉 Successfully joined ${data.company.name}!`, {
          description: 'You can now create invoices with pre-filled company data.',
          duration: 5000,
        })
      } else {
        toast.success(data.message)
      }
      // Redirect to dashboard after joining
      setTimeout(() => {
        router.push('/dashboard')
      }, 2000)
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to join company')
      router.push('/dashboard')
    }
  })

  useEffect(() => {
    if (ready && authenticated && inviteToken && !isProcessing) {
      setIsProcessing(true)
      joinCompany.mutate({ token: inviteToken })
    }
  }, [ready, authenticated, inviteToken, isProcessing])

  if (!inviteToken) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center gap-4 max-w-md mx-4">
        <div className="p-3 bg-blue-100 rounded-full">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Processing Invitation
          </h3>
          <p className="text-gray-600">
            Adding you to the company...
          </p>
        </div>
      </div>
    </div>
  )
}