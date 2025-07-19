"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { DashboardFilterState } from "./DashboardFilter";

interface DashboardFilterContextType {
    filters: DashboardFilterState;
    setFilters: (filters: DashboardFilterState) => void;
}

const DashboardFilterContext = createContext<DashboardFilterContextType | undefined>(undefined);

export function DashboardFilterProvider({ children }: { children: ReactNode }) {
    const [filters, setFilters] = useState<DashboardFilterState>({
        startDate: "",
        endDate: "",
        timeRange: "week"
    });

    return (
        <DashboardFilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </DashboardFilterContext.Provider>
    );
}

export function useDashboardFilter() {
    const context = useContext(DashboardFilterContext);
    if (context === undefined) {
        throw new Error('useDashboardFilter must be used within a DashboardFilterProvider');
    }
    return context;
} 