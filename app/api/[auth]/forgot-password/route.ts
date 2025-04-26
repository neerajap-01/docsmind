import { AUTHROUTES, SERVER } from "@/contants/endpoints.contants";
import { fetchData } from "@/utils/fetchData";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body: ForgotPasswordReqPayload = await req.json();

    const res = await fetchData(
      SERVER,
      AUTHROUTES.forgotPassword(),
      "post",
      body,
      {},
      {
        "Authorization": `Bearer ${req.headers.get("Authorization")}`,
      }
    );

    return NextResponse.json(res);
  } catch (error) {
    console.error("Internal Server Error: ", error);
    return NextResponse.json("Error: Something went wrong. Try again!", {
      status: 500,
    });
  }
}