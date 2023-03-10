import type { NextApiRequest, NextApiResponse } from 'next'
import jwt from 'jsonwebtoken';
type Data = {
    user: {
        waId: string,
        waNumber: string,
        waName: string,
        timestamp: string,
        accessToken: string
    },
    success: boolean
}
type Error = {
    err: string
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data | Error>) {
    if (req.method !== 'POST') res.status(405).end(`Method ${req.method} Not Allowed`)
    if (!process.env.OTPLESS_CLIENT_ID) throw new Error('NO OTPLESS CLIENT ID FOUND');
    if (!process.env.OTPLESS_CLIENT_SECRET) throw new Error('NO OTPLESS CLIENT SECRET FOUND');
    if (!process.env.NEXTAUTH_SECRET) throw new Error('NO NEXTAUTH SECRET FOUND');
    try {
        const waId = req.body.waId;
        const response = await fetch('https://fimple.authlink.me/', {
            method: 'POST',
            body: JSON.stringify({ waId }),
            headers: {
                'Content-Type': 'application/json',
                clientId: process.env.OTPLESS_CLIENT_ID,
                clientSecret: process.env.OTPLESS_CLIENT_SECRET,
            }
        });
        if (!response.ok) throw new Error('Auth Failed');
        const { user, success }: Data = await response.json();
        if (!success) throw new Error('Auth Failed');
        user.accessToken = jwt.sign({ id: user.waNumber }, process.env.NEXTAUTH_SECRET, {
            expiresIn: 86400 * 30,
        })
        res.status(200).json({ user, success });
    } catch (error) {
        res.status(401).json({ err: 'Unauthorized' });
    }

}