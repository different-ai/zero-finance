'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Zap, CheckCircle2 } from "lucide-react";

export function ValueJourney() {
  return (
    <Card className="border-border/40 bg-background/60 backdrop-blur-sm">
      <CardHeader>
        <CardDescription>See how HyprSqrl automates your workflow</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border-border/40 bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MessageSquare className="mr-2 h-4 w-4 text-[#6E45FE]" />
                1. Detect
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                AI monitors your messages and identifies actionable items.
              </p>
              <div className="mt-4 p-2 bg-muted/40 rounded-md">
                <p className="text-sm italic">
                  "Don't forget to tweet about Vitalik's keynote at Unconf!"
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Zap className="mr-2 h-4 w-4 text-[#6E45FE]" />
                2. Automate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                HyprSqrl automatically creates tasks and drafts content.
              </p>
              <div className="mt-4 space-y-2">
                <Badge variant="secondary" className="bg-[#6E45FE]/10 text-[#6E45FE] hover:bg-[#6E45FE]/20">
                  Task Created
                </Badge>
                <p className="text-sm">Draft tweet about Vitalik</p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40 bg-background/60">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <CheckCircle2 className="mr-2 h-4 w-4 text-[#6E45FE]" />
                3. Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Review and approve AI-generated content with one click.
              </p>
              <div className="mt-4 p-2 bg-muted/40 rounded-md">
                <p className="text-sm">
                  🚀 Exciting news! @VitalikButerin will be delivering a keynote at #Unconf2023! Don't miss this opportunity to hear from one of the brightest minds in crypto. Get your tickets now at unconf.crypto 🎟️ #Ethereum #Blockchain
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
} 