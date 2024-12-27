"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

export function DonationBox() {
  const [amount, setAmount] = useState("");

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically integrate with a payment processor
    toast({
      title: "Thank you for your donation!",
      description: `You've pledged $${amount}. This is a mock donation.`,
    });
    setAmount("");
  };

  return (
    <Card className="w-[300px] fixed bottom-4 right-4 z-50">
      <CardHeader>
        <CardTitle>Support This Project</CardTitle>
        <CardDescription>
          Your contribution helps keep this resource free and updated.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDonate}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="amount">Donation Amount ($)</Label>
              <Input
                id="amount"
                placeholder="Enter amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button onClick={handleDonate}>Donate</Button>
      </CardFooter>
    </Card>
  );
}
