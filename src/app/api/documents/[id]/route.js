import connectToDatabase from "@/db/db-connect";
import { authenticate } from "@/lib/authenticate";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectToDatabase();

    try {
        // Authenticate the user
        const { user, error } = await authenticate(req);
        console.log("Authenticated User:", user);
        if (error) {
            return NextResponse.json({ message: error }, { status: 401 });
        }

        // Extract document ID from params
        const { id } = params;
        console.log("Params:", params);

        // Validate document ID
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return NextResponse.json({ message: "Invalid document ID" }, { status: 400 });
        }

        // Fetch the document
        const document = await Docs.findOne({
            _id: id,
            userId: user.id,
        });

        if (!document) {
            return NextResponse.json(
                { message: "Document not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({ document }, { status: 200 });
    } catch (err) {
        console.error("Error fetching document:", err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}


export async function PUT(req, { params }) {
    await connectToDatabase();

    try {
        // Validate user token
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ message: error }, { status: 401 });
        }

        // Extract document ID and updated data from the request
        const { id } = params;
        const { title, content, docType, isPublished } = await req.json();

        // Find and update the document
        const updatedDoc = await Docs.findOneAndUpdate(
            { _id: id, userId: user.id },
            { title, content, docType, isPublished },
            { new: true }
        );

        if (!updatedDoc) {
            return NextResponse.json(
                { message: "Document not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Document updated", document: updatedDoc }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}


export async function DELETE(req, { params }) {
    await connectToDatabase();

    try {
        // Validate user token
        const { user, error } = await authenticate(req);
        if (error) {
            return NextResponse.json({ message: error }, { status: 401 });
        }

        // Extract document ID from the params
        const { id } = params;

        // Find and delete the document
        const deletedDoc = await Docs.findOneAndDelete({ _id: id, userId: user.id });

        if (!deletedDoc) {
            return NextResponse.json(
                { message: "Document not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({ message: "Document deleted", document: deletedDoc }, { status: 200 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
