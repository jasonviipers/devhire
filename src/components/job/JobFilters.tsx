"use client";

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterX, SlidersHorizontal, X } from "lucide-react";
import { countryList } from "@/lib/countriesList";
import { useDebounce } from '@/hooks/useDebounce';

export function JobFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);
  
  // Local state for salary inputs
  const [minSalary, setMinSalary] = useState(searchParams.get("minSalary") || "");
  const [maxSalary, setMaxSalary] = useState(searchParams.get("maxSalary") || "");
  
  const debouncedMinSalary = useDebounce(minSalary, 500);
  const debouncedMaxSalary = useDebounce(maxSalary, 500);

  const jobTypes = ["full-time", "part-time", "contract", "internship"];
  const currentJobTypes = searchParams.get("jobTypes")?.split(",") || [];
  const currentLocation = searchParams.get("location") || "";

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (currentJobTypes.length) count += 1;
    if (currentLocation) count += 1;
    if (minSalary || maxSalary) count += 1;
    setActiveFiltersCount(count);
  }, [currentJobTypes, currentLocation, minSalary, maxSalary]);

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      
      Object.entries(updates).forEach(([name, value]) => {
        if (value === null) {
          params.delete(name);
        } else {
          params.set(name, value);
        }
      });
      
      return params.toString();
    },
    [searchParams]
  );

  // Handle salary changes with debounce
  useEffect(() => {
    if (debouncedMinSalary !== searchParams.get("minSalary")) {
      router.push(`?${createQueryString({ minSalary: debouncedMinSalary || null })}`);
    }
  }, [debouncedMinSalary]);

  useEffect(() => {
    if (debouncedMaxSalary !== searchParams.get("maxSalary")) {
      router.push(`?${createQueryString({ maxSalary: debouncedMaxSalary || null })}`);
    }
  }, [debouncedMaxSalary]);

  const handleJobTypeChange = (type: string, checked: boolean) => {
    const current = new Set(currentJobTypes);
    if (checked) {
      current.add(type);
    } else {
      current.delete(type);
    }
    
    const newValue = Array.from(current);
    router.push(`?${createQueryString({ 
      jobTypes: newValue.length ? newValue.join(",") : null 
    })}`);
  };

  const clearFilters = () => {
    setMinSalary("");
    setMaxSalary("");
    router.push("/");
    setIsOpen(false);
  };

  const FilterContent = () => (
    <div className="space-y-6">
      <FilterSection
        title="Job Type"
        badge={currentJobTypes.length}
        onClear={currentJobTypes.length > 0 ? () => 
          router.push(`?${createQueryString({ jobTypes: null })}`) : undefined}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {jobTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2 group">
              <Checkbox
                id={type}
                checked={currentJobTypes.includes(type)}
                onCheckedChange={(checked) =>
                  handleJobTypeChange(type, checked as boolean)
                }
                className="data-[state=checked]:bg-primary"
              />
              <Label
                htmlFor={type}
                className="text-sm font-medium capitalize cursor-pointer select-none 
                         group-hover:text-primary transition-colors"
              >
                {type}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      <Separator />

      <FilterSection
        title="Location"
        badge={currentLocation ? 1 : 0}
        onClear={currentLocation ? () => 
          router.push(`?${createQueryString({ location: null })}`) : undefined}
      >
        <Select 
          value={currentLocation} 
          onValueChange={(value) => {
            router.push(`?${createQueryString({ location: value })}`)
            setIsOpen(false);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Location" />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            <SelectGroup>
              <SelectLabel>Worldwide</SelectLabel>
              <SelectItem value="worldwide">
                <div className="flex items-center">
                  <span>🌍</span>
                  <span className="ml-2">Worldwide / Remote</span>
                </div>
              </SelectItem>
            </SelectGroup>
            <Separator className="my-2" />
            <SelectGroup>
              <SelectLabel>Countries</SelectLabel>
              {countryList.map((country) => (
                <SelectItem value={country.name} key={country.name}>
                  <div className="flex items-center">
                    <span>{country.flagEmoji}</span>
                    <span className="ml-2">{country.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </FilterSection>

      <Separator />

      <FilterSection
        title="Salary Range"
        badge={(minSalary || maxSalary) ? 1 : 0}
        onClear={(minSalary || maxSalary) ? () => {
          setMinSalary("");
          setMaxSalary("");
          router.push(`?${createQueryString({ 
            minSalary: null, 
            maxSalary: null 
          })}`);
        } : undefined}
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="minSalary" className="text-sm">
              Min Salary
            </Label>
            <Input
              id="minSalary"
              type="number"
              placeholder="0"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
              className="w-full"
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="maxSalary" className="text-sm">
              Max Salary
            </Label>
            <Input
              id="maxSalary"
              type="number"
              placeholder="500,000"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
              className="w-full"
              min="0"
            />
          </div>
        </div>
      </FilterSection>
    </div>
  );

  return (
    <>
      <div className="lg:hidden flex items-center space-x-2">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:w-96">
            <SheetHeader>
              <SheetTitle className="flex justify-between items-center">
                Filters
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-8 px-2 text-muted-foreground hover:text-destructive"
                  >
                    <FilterX className="h-4 w-4 mr-2" />
                    Reset all
                  </Button>
                )}
              </SheetTitle>
            </SheetHeader>
            <Separator className="my-4" />
            <div className="h-[calc(100vh-8rem)] overflow-y-auto pb-8">
              <FilterContent />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <Card className="hidden lg:block sticky top-4 h-fit">
        <CardHeader className="space-y-4">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl font-semibold">Filters</CardTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="h-8 px-2 text-muted-foreground hover:text-destructive"
              >
                <FilterX className="h-4 w-4 mr-2" />
                Reset all
              </Button>
            )}
          </div>
          <Separator />
        </CardHeader>
        <CardContent>
          <FilterContent />
        </CardContent>
      </Card>
    </>
  );
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  badge?: number;
  onClear?: () => void;
}

const FilterSection = React.memo(({ 
  title, 
  children, 
  badge = 0,
  onClear 
}: FilterSectionProps) => (
  <div className="space-y-4">
    <div className="flex items-center justify-between">
      <Label className="text-lg font-semibold">{title}</Label>
      <div className="flex items-center space-x-2">
        {badge > 0 && (
          <Badge variant="secondary" className="h-6 w-6 p-0 flex items-center justify-center">
            {badge}
          </Badge>
        )}
        {onClear && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClear}
            className="h-6 w-6 p-0 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
    {children}
  </div>
));

FilterSection.displayName = 'FilterSection';