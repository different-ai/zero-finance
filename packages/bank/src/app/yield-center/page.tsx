import { AlertTriangle, PiggyBank, TrendingUp } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/src/components/ui/card";
import { yieldOpportunities, yieldPositions } from "@/src/lib/mock-data";
import { formatCurrency, formatDate } from "@/src/lib/utils";

export default function YieldCenterPage() {
  // Get active yield positions for this user
  const activePositions = yieldPositions.filter(pos => pos.status === "active");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Yield Center</h1>
        <p className="text-muted-foreground">Maximize returns on your idle assets</p>
      </div>

      {/* Active positions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Your Active Yield Positions</h2>
        {activePositions.length > 0 ? (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
            {activePositions.map((position) => {
              const opportunity = yieldOpportunities.find(
                (o) => o.id === position.opportunityId
              );

              if (!opportunity) return null;

              return (
                <Card key={position.id}>
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{opportunity.name}</CardTitle>
                      <div className="rounded-full px-2 py-1 text-xs bg-secondary">
                        {position.status.charAt(0).toUpperCase() + position.status.slice(1)}
                      </div>
                    </div>
                    <CardDescription>{opportunity.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-sm">Amount:</span>
                      <span className="font-bold">
                        {formatCurrency(position.amount, position.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Expected Interest:</span>
                      <span className="font-bold text-green-500">
                        {formatCurrency(position.expectedInterest, position.currency)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">APY:</span>
                      <span className="font-bold text-green-500">{opportunity.apy}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Start Date:</span>
                      <span>{formatDate(position.startDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Maturity Date:</span>
                      <span>
                        {position.endDate.getTime() === 0
                          ? "Flexible"
                          : formatDate(position.endDate)}
                      </span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">Manage Position</Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="pt-6 text-center">
              <p>You don't have any active yield positions.</p>
              <Button className="mt-4">Start Earning Now</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Available opportunities */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Available Yield Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {yieldOpportunities.map((opportunity) => {
            const getRiskIcon = (risk: string) => {
              switch (risk) {
                case "low":
                  return <PiggyBank className="h-5 w-5 text-green-500" />;
                case "medium":
                  return <TrendingUp className="h-5 w-5 text-yellow-500" />;
                case "high":
                  return <AlertTriangle className="h-5 w-5 text-red-500" />;
                default:
                  return <PiggyBank className="h-5 w-5" />;
              }
            };

            return (
              <Card key={opportunity.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getRiskIcon(opportunity.risk)}
                      <CardTitle>{opportunity.name}</CardTitle>
                    </div>
                  </div>
                  <CardDescription>{opportunity.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm">APY:</span>
                    <span className="font-bold text-green-500">{opportunity.apy}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Min Investment:</span>
                    <span>
                      {formatCurrency(opportunity.minInvestment, opportunity.currency)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Term:</span>
                    <span>
                      {opportunity.term === 0 ? "Flexible" : `${opportunity.term} days`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Risk Level:</span>
                    <span
                      className={`${
                        opportunity.risk === "low"
                          ? "text-green-500"
                          : opportunity.risk === "medium"
                          ? "text-yellow-500"
                          : "text-red-500"
                      }`}
                    >
                      {opportunity.risk.charAt(0).toUpperCase() + opportunity.risk.slice(1)}
                    </span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Invest Now</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}