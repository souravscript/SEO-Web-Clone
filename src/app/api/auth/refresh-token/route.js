import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { supabase } from "@/lib/supabase";

export async function POST(req) {
    try {
        const cookieStore = cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;
        const currentAccessToken = cookieStore.get('access_token')?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { message: "No refresh token found" },
                { status: 401 }
            );
        }

        // Exchange refresh token for a new access token using Supabase
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token: refreshToken
        });

        if (error) {
            console.error("Token refresh error:", error.message);
            
            // Clear existing tokens on refresh failure
            const response = NextResponse.json(
                { message: error.message || "Failed to refresh token" },
                { status: 401 }
            );
            
            response.cookies.delete('access_token');
            response.cookies.delete('refresh_token');
            
            return response;
        }

        const { session } = data;
        if (!session) {
            return NextResponse.json(
                { message: "No session returned from refresh" },
                { status: 401 }
            );
        }

        const { access_token, refresh_token } = session;

        // Create response with new tokens
        const response = NextResponse.json(
            { message: "Token refreshed successfully" },
            { status: 200 }
        );

        // Set new cookies with consistent naming
        response.cookies.set('access_token', access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 15 * 60, // 15 minutes
            path: '/'
        });

        response.cookies.set('refresh_token', refresh_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: '/'
        });
        console.log("response in the api/auth/refresh-token/route.js ",response);
        return response;
    } catch (error) {
        console.error("Unexpected error during token refresh:", error);
        return NextResponse.json(
            { message: "Internal server error during token refresh" },
            { status: 500 }
        );
    }
}
