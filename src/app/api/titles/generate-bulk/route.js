import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { keywords } = await request.json();

        // Validate input
        if (!keywords || !Array.isArray(keywords) || keywords.length === 0) {
            return NextResponse.json({ 
                error: 'Keywords array is required and must not be empty' 
            }, { status: 400 });
        }

        // Prepare promises for title generation
        const titlePromises = keywords.map(async (keyword) => {
            const result = await fetch('http://34.131.28.178:8080/api/titles/generate-title', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ keywords: keyword })
            });

            if (!result.ok) {
                return { keyword, title: null, error: 'Failed to generate title' };
            }

            const data = await result.json();
            return { 
                keyword, 
                title: data.title ? data.title.trim().replace(/^["'\s]+|["'\s]+$/g, '') : null 
            };
        });

        // Wait for all title generations
        const titles = await Promise.all(titlePromises);

        return NextResponse.json(titles, { status: 200 });
    } catch (error) {
        console.error('Bulk title generation error:', error);
        return NextResponse.json({ 
            error: 'Internal server error' 
        }, { status: 500 });
    }
}
