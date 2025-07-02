import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_GITHUB_CLIENT_ID = "Iv23li0QH4jp4B1kJdyO";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.action === 'start') {
      // Start the device flow
      const response = await fetch('https://github.com/login/device/code', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'awesome-shadcn-ui'
        },
        body: JSON.stringify({
          client_id: PUBLIC_GITHUB_CLIENT_ID,
          scope: 'public_repo'
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
      
    } else if (body.action === 'poll') {
      // Poll for the access token
      const response = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'User-Agent': 'awesome-shadcn-ui'
        },
        body: JSON.stringify({
          client_id: PUBLIC_GITHUB_CLIENT_ID,
          device_code: body.device_code,
          grant_type: 'urn:ietf:params:oauth:grant-type:device_code',
        }),
      });

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    
  } catch (error: any) {
    console.error('GitHub device flow error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
} 