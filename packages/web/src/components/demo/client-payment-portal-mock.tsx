"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Landmark, Lock } from "lucide-react"

export function ClientPaymentPortalMock() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed inset-0 bg-gray-800/50 backdrop-blur-sm flex items-center justify-center z-[150] p-4"
    >
      <Card className="w-full max-w-sm shadow-2xl bg-background">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center bg-primary/10 text-primary p-3 rounded-full mb-3 mx-auto">
            <Lock className="h-6 w-6" />
          </div>
          <CardTitle className="text-xl">Secure Payment</CardTitle>
          <CardDescription>Invoice #4128 from Zero Finance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">Amount Due</p>
            <p className="text-3xl font-bold">€8,500.00</p>
          </div>
          <Button className="w-full" size="lg" disabled>
            <CreditCard className="mr-2 h-4 w-4" /> Pay with Card
          </Button>
          <Button variant="outline" className="w-full" size="lg" disabled>
            <Landmark className="mr-2 h-4 w-4" /> Pay with Bank Transfer
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center text-xs text-muted-foreground">
          <p>Powered by Zero Finance</p>
          <p className="mt-1">Mock Payment Screen</p>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
