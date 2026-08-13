import { NextResponse } from "next/server"

export async function GET(){
    await NextResponse.json({name: "Mafia"});
    
}