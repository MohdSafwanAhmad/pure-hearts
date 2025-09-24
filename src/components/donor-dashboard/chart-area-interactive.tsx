"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/ui/chart";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

type DonationPoint = { date: string; amount: number };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Props = {
  /** aggregated per day: [{ date: "YYYY-MM-DD", amount: number }] */
  series?: DonationPoint[];
};

type Point = { date: string; amount: number };

export default function ChartAreaInteractive({
  series = [],
}: {
  series?: Point[];
}) {
  const [timeRange, setTimeRange] = React.useState<"90d" | "30d" | "7d">("90d");

  const filteredData = React.useMemo(() => {
    if (!Array.isArray(series) || series.length === 0) return [];

    // keep sorted by date ASC
    const sorted = [...series].sort((a, b) => a.date.localeCompare(b.date));

    // last point’s date, fallback to today
    const last = sorted[sorted.length - 1];
    const endISO = last?.date ?? new Date().toISOString().slice(0, 10);

    const endDate = new Date(endISO + "T00:00:00Z");
    const days = timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90;

    // start date inclusive
    const startDate = new Date(endDate);
    startDate.setDate(endDate.getDate() - days + 1);

    // index for quick lookup
    const byDate = new Map(sorted.map((d) => [d.date, Number(d.amount) || 0]));

    const out: DonationPoint[] = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const key = d.toISOString().slice(0, 10);
      out.push({ date: key, amount: byDate.get(key) ?? 0 });
    }
    return out;
  }, [series, timeRange]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Your Donation Trend</CardTitle>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onValueChange={(v) => v && setTimeRange(v as any)}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select
            value={timeRange}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onValueChange={(v) => setTimeRange(v as any)}
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={{
            amount: { label: "Amount", color: "var(--primary)" },
          }}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={filteredData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) =>
                new Date(String(value)).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }
            />
            <ChartTooltip
              cursor={{ fillOpacity: 0.06 }}
              // format the bar value as currency
              formatter={(val: number) =>
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                }).format(Number(val) || 0)
              }
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(String(value)).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })
                  }
                />
              }
            />
            <Bar
              dataKey="amount"
              fill="var(--color-desktop)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
