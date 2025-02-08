import { ChevronRight } from 'lucide-react';
import React from 'react'

type BreadcrumbItem = {
    label: string;
    href: string;
  };
  
  type BreadcrumbProps = {
    items: BreadcrumbItem[];
  };
export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-gray-200" aria-hidden="true" />
            )}
            {index === items.length - 1 ? (
              <span className="text-sm font-medium text-gray-500" aria-current="page">
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="text-sm font-medium text-gray-300 hover:text-gray-400"
              >
                {item.label}
              </a>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
