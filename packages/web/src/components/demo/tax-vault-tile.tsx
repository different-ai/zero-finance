import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Landmark, Settings, UploadCloud, CalendarCheck2 } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface TaxVaultTileProps {
  amount: number
  nextTaxDueDate?: string // e.g., "€2,550 (Est. Jul 15)"
  showDetailCard?: boolean // From scene, to trigger more detailed view or buttons
}

export function TaxVaultTile({ amount, nextTaxDueDate, showDetailCard }: TaxVaultTileProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className={showDetailCard ? "border-2 border-primary shadow-lg" : ""}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tax Vault</CardTitle>
              <Landmark className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <p className="text-xs text-muted-foreground">Reserved for Taxes</p>
              {nextTaxDueDate && (
                <div className="mt-2 flex items-center text-xs text-muted-foreground">
                  <CalendarCheck2 className="h-3.5 w-3.5 mr-1.5 text-sky-500" />
                  <span>Next Payment: {nextTaxDueDate}</span>
                </div>
              )}
            </CardContent>
            {showDetailCard && (
              <CardFooter className="flex-col items-stretch gap-2 pt-2">
                <CardDescription className="text-xs text-center mb-2">
                  Funds are ready and accounted for.
                </CardDescription>
                <Button variant="outline">
                  <UploadCloud className="mr-2 h-4 w-4" /> Record Tax Payment Made
                </Button>
                <Button variant="ghost" size="sm" className="text-xs">
                  <Settings className="mr-2 h-3 w-3" /> Adjust Tax Withholding %
                </Button>
              </CardFooter>
            )}
          </Card>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Funds held in euroe smart contract</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
