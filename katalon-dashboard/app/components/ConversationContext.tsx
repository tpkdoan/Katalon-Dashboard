"use client";
import { createContext, useContext, ReactNode } from "react";

interface ConversationContextType {
    onConversationSelect?: (id: string) => void;
}

const ConversationContext = createContext<ConversationContextType>({});

export const useConversationContext = () => {
    const context = useContext(ConversationContext);
    if (!context) {
        throw new Error("useConversationContext must be used within a ConversationProvider");
    }
    return context;
};

interface ConversationProviderProps {
    children: ReactNode;
    onConversationSelect?: (id: string) => void;
}

export const ConversationProvider = ({ children, onConversationSelect }: ConversationProviderProps) => {
    return (
        <ConversationContext.Provider value={{ onConversationSelect }}>
            {children}
        </ConversationContext.Provider>
    );
}; 