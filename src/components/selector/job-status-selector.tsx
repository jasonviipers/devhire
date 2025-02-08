import React from 'react';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { JobPostStatus } from '@prisma/client';
import { Control } from 'react-hook-form';

interface JobStatusSelectorProps {
    control: Control<any>;
    defaultValue?: JobPostStatus;
}

export const JobStatusSelector = ({ control, defaultValue = "DRAFT" }: JobStatusSelectorProps) => {
    const getStatusColor = (status: JobPostStatus) => {
        switch (status) {
            case "ACTIVE":

                return "bg-green-500/20 text-green-600 hover:bg-green-500/20";
            case "DRAFT":
                return "bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/20";
            case "EXPIRED":
                return "bg-red-500/20 text-red-600 hover:bg-red-500/20";
            default:
                return "";
        }
    };

    return (
        <FormField
            control={control}
            name="status"
            render={({ field }) => (
                <FormItem>
                    <FormLabel>Job Status</FormLabel>
                    <FormControl>
                        <Select
                            onValueChange={field.onChange}
                            defaultValue={defaultValue}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select status">
                                    {field.value && (
                                        <Badge className={getStatusColor(field.value)}>
                                            {field.value}
                                        </Badge>
                                    )}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="DRAFT">
                                        <Badge className={getStatusColor("DRAFT")}>DRAFT</Badge>
                                    </SelectItem>
                                    <SelectItem value="ACTIVE">
                                        <Badge className={getStatusColor("ACTIVE")}>ACTIVE</Badge>
                                    </SelectItem>
                                    <SelectItem value="EXPIRED">
                                        <Badge className={getStatusColor("EXPIRED")}>EXPIRED</Badge>
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};
