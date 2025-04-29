"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAddressVisibility } from "@/hooks/use-address-visibility";
import { Shield, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

export function AddressVisibilityToggle() {
  const { 
    showAddresses, 
    toggleAddressVisibility,
    isLoading,
    isUpdating
  } = useAddressVisibility();

  const handleToggle = async () => {
    try {
      await toggleAddressVisibility();
      toast.success(
        showAddresses 
          ? "Addresses will now be masked" 
          : "Full addresses will now be shown"
      );
    } catch (error) {
      toast.error("Failed to update setting");
      console.error("Setting update error:", error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield size={20} className="text-primary" />
          Address Privacy
        </CardTitle>
        <CardDescription>
          Control how blockchain addresses are displayed throughout the app
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-addresses">
              {showAddresses ? (
                <span className="flex items-center gap-1">
                  <Eye size={16} />
                  Show Full Addresses
                </span>
              ) : (
                <span className="flex items-center gap-1">
                  <EyeOff size={16} />
                  Mask Addresses
                </span>
              )}
            </Label>
            <p className="text-muted-foreground text-sm">
              {showAddresses 
                ? "Displaying complete addresses (0x1234...)" 
                : "Displaying shortened addresses (0x12...34)"}
            </p>
          </div>
          <Switch
            id="show-addresses"
            checked={showAddresses}
            onCheckedChange={handleToggle}
            disabled={isLoading || isUpdating}
          />
        </div>
      </CardContent>
    </Card>
  );
} 