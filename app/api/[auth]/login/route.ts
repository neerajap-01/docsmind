import { AUTHROUTES, SERVER } from "@/contants/endpoints.contants";
import { fetchData } from "@/utils/fetchData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: UserLoginPayload = await req.json();

    const res = await fetchData(
      SERVER,
      AUTHROUTES.login(),
      "post",
      body,
      {},
      {
        "Authorization": `Bearer ${req.headers.get("Authorization")}`,
      }
    );
    
    // Parse the JSON data from the response
    //@typescript-eslint/no-explicit-unknown
    //@ts-ignore
    const data: unknown = await res.json();

    // Create a NextResponse with the data
    const nextResponse = NextResponse.json(data);

    const setCookieHeader = res.headers.get("set-cookie");

    if (setCookieHeader) {
      nextResponse.headers.append("Set-Cookie", setCookieHeader);
    }

    // Return the NextResponse
    return nextResponse;
  } catch (error) {
    console.error("Internal Server Error: ", error);
    return NextResponse.json("Error: Something went wrong. Try again!", {
      status: 500,
    });
  }
}