'use client';

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Search } from "lucide-react";
import { Control, useController } from 'react-hook-form';
import { countryList } from '@/lib/countriesList';

interface CountrySelectorProps {
    control: Control<any>;
    name: string;
    label: string;
    defaultValue?: string;
    error?: React.ReactNode;
}

export function CountrySelector({ control, name, label, defaultValue, error }: CountrySelectorProps) {
    const { field } = useController({
        control,
        name,
        defaultValue,
    });
    const [searchQuery, setSearchQuery] = useState("");

    const filteredCountries = countryList.filter(country =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) 
    );

    return (
        <FormItem>
            <FormLabel>{label}</FormLabel>
            <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
            >
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Location" />
                    </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-96">
                    <div className="sticky top-0 bg-background p-2 border-b">
                        <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search countries by name or code..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <SelectGroup>
                        <SelectLabel>Worldwide</SelectLabel>
                        <SelectItem value="worldwide">
                            <span>🌍</span>
                            <span className="pl-2">Worldwide / Remote</span>
                        </SelectItem>
                    </SelectGroup>
                    {filteredCountries.length > 0 ? (
                        <SelectGroup>
                            <SelectLabel>Countries</SelectLabel>
                            {filteredCountries.map((country) => (
                                <SelectItem
                                    key={country.code}
                                    value={country.name}
                                    className="cursor-pointer"
                                >
                                    <span>{country.flagEmoji}</span>
                                    <span className="pl-2">{country.name} ({country.code})</span>
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    ) : (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                            No countries found
                        </div>
                    )}
                </SelectContent>
            </Select>
            {error && <FormMessage>{error}</FormMessage>}
        </FormItem>
    );
}