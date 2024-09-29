import { NextRequest, NextResponse } from 'next/server';
import { StreamClient, UserRequest } from '@stream-io/node-sdk';

const apiKey = process.env.PUBLIC_GET_STREAM_API_KEY;
const apiSecret = process.env.PRIVATE_GET_STREAM_API_KEY;

if (!apiKey || !apiSecret) {
  throw new Error('Missing STREAM_API_KEY or STREAM_API_SECRET');
}

const client = new StreamClient(apiKey, apiSecret);
export async function POST(req: NextRequest) {
  const { userId, name, image, email } = await req.json();

  const newUser: UserRequest = {
    id: userId,
    role: 'name',
    name,
    image,
    custom: {
      email,
    },
  };
  await client.upsertUsers([newUser]);

  const validity = 60 * 60;
  const token = client.generateUserToken({
    user_id: userId,
    validity_in_seconds: validity,
  });
  console.log(
    `User ${userId} created with token ${token} and validity ${validity} seconds`
  );

  return NextResponse.json({ token });
}
