export async function POST(request) {
    try {
        const data = await request.json();
        const { base64, id } = data;
        const result = await updatePfp(base64, id);
        console.log(result);
        return NextResponse.json({success: "success"});
    } catch (err) {
        console.error("DB error", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}