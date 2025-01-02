'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

export function PaymentMethodSelector() {
  const [selectedValue, setSelectedValue] = useState('crypto')

  return (
    <div className="space-y-6">
      <Tabs defaultValue="regular" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="regular">Regular Invoice</TabsTrigger>
          <TabsTrigger value="recurring" disabled>Recurring Invoice (coming soon)</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="space-y-4">
        <RadioGroup defaultValue="crypto" onValueChange={setSelectedValue}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="crypto" id="crypto" />
            <Label htmlFor="crypto">Crypto</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="fiat" id="fiat" disabled />
            <Label htmlFor="fiat" className="flex items-center gap-2">
              Fiat (EUR)
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">Coming soon</span>
            </Label>
          </div>
        </RadioGroup>

        {selectedValue === 'crypto' && (
          <>
            <div className="space-y-2">
              <Label>Choose your payment network</Label>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent">
                  <Image src="/ethereum-logo.svg" alt="Ethereum" width={20} height={20} />
                  Ethereum
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent">
                  <Image src="/polygon-logo.svg" alt="Polygon" width={20} height={20} />
                  Polygon
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Choose your currency</Label>
              <div className="flex gap-2">
                <button className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent">
                  <Image src="/dai-logo.svg" alt="DAI" width={20} height={20} />
                  DAI
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent">
                  <Image src="/usdc-logo.svg" alt="USDC" width={20} height={20} />
                  USDC
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent">
                  <img src="/eure-logo.png" alt="EURe" width={20} height={20} />
                  EURe
                </button>
                <button className="flex items-center gap-2 px-3 py-2 rounded-md border hover:bg-accent">
                  <Image src="/ethereum-logo.svg" alt="ETH" width={20} height={20} />
                  ETH
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Where do you want to receive your payment?</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Find or add new wallet" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Add new wallet</SelectItem>
                  <SelectItem value="existing1">0x1234...5678</SelectItem>
                  <SelectItem value="existing2">0x8765...4321</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

