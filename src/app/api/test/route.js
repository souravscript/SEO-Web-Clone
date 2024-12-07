import User from "@/models/User";

export async function GET(req) {
  try {
    // Connect to the database
    await connectToDatabase();

    // Fetch all users
    const users = await User.find({});

    // Return the users in the response
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);

    // Handle errors
    return NextResponse.json(
      { error: "Failed to fetch users. Please try again later." },
      { status: 500 }
    );
  }
}