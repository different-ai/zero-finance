"use client"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShieldCheck, CreditCard, PiggyBank, CheckCircle } from "lucide-react"

const setupSteps = [
  {
    icon: ShieldCheck,
    title: "Secure Account Created",
    description: "Your primary business account is ready.",
  },
  {
    icon: CreditCard,
    title: "Virtual ACH Details Active",
    description: "Instantly receive client payments.",
  },
  {
    icon: PiggyBank,
    title: "Auto-Savings Set to 20%", // Example percentage
    description: "Automatically reserves a portion of incoming funds.",
  },
]

export function InitialSetupGlimpse() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
      className="fixed inset-0 bg-background/90 backdrop-blur-sm flex items-center justify-center z-[150] p-4"
    >
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">One-Time Setup Complete</CardTitle>
          <CardDescription>You're all set to automate your finances.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {setupSteps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.15, ease: "easeOut" }}
              className="flex items-start p-3 border rounded-lg bg-background"
            >
              <step.icon className="h-7 w-7 text-primary mr-4 mt-1 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-base">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
              <CheckCircle className="h-5 w-5 text-green-500 ml-3 flex-shrink-0 self-center" />
            </motion.div>
          ))}
          <p className="text-xs text-muted-foreground text-center pt-3">
            (This is a brief glimpse of the initial setup)
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
