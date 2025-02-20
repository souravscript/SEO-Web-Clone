import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keywords } = await request.json();

        // Validate input
        if (!keywords) {
            return NextResponse.json({ 
                error: 'Keywords are required' 
            }, { status: 400 });
        }

        // Forward request to external title generation service
        const result = await fetch('http://34.131.28.178:8080/api/titles/generate-title', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ keywords })
        });

        if (!result.ok) {
            return NextResponse.json({ 
                error: 'Failed to generate title' 
            }, { status: result.status });
        }

        const data = await result.json();

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error('Title generation error:', error);
        return NextResponse.json({ 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
