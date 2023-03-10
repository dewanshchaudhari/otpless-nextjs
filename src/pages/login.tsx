import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function Login() {
    const router = useRouter();
    useEffect(() => {
        const waId = router.query.waId;
        if (!waId) return;
        signIn('credentials', { waId, redirect: true, callbackUrl: '/' });
    }, [router.isReady, router.query.waId])
    return <div className='h-screen w-screen flex flex-col items-center justify-center'>
        <Link href="https://fimple.authlink.me" target="_blank" rel="noopener noreferrer">
            <button type="button" style={{
                border: "none", background: "transparent", outline: "none",
            }}
            >
                <img src="https://otpless-cdn.s3.ap-south-1.amazonaws.com/otpless_button.svg" style={{ width: '300px' }} />
            </button>
        </Link>
    </div >
}