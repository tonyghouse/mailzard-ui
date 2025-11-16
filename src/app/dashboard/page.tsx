// components/DashboardPage.jsx
"use client"; // Marks this as a client component if using Next.js App Router

import React, { useEffect } from 'react';
import { useAuth } from "@clerk/nextjs"; // or @clerk/clerk-react

function DashboardPage() {
    const { getToken, isLoaded, userId } = useAuth();

    useEffect(() => {
        const logToken = async () => {
            if (isLoaded && userId) {
                // Get the token with a specific template (e.g., 'session') if needed, 
                // but by default, it gets the current session token.
                const token = await getToken(); 
                console.log("Clerk Session Token (for local only):", token);
            }
        };

        logToken();
    }, [getToken, isLoaded, userId]); // Re-run if auth state changes

    return (
        <div>
            <h1>Dashboard Page</h1>
            <p>Check the console for the token.</p>
        </div>
    );
}

export default DashboardPage;
