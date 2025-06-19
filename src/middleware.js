import { NextResponse } from 'next/server'
import { getServerSession } from "next-auth/next"
import { authOptions } from './app/api/auth/[...nextauth]/route'
 
export async function middleware(request) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.redirect(new URL('/ssss', request.url))
    }
}
 
export const config = {
  matcher: '/ssssss/:path*',
}