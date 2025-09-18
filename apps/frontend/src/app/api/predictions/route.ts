// apps/frontend/src/app/api/predictions/route.ts

import { NextRequest, NextResponse } from "next/server";
import { fetchPredictions } from "@services/predictionsService";
import PredictionController from "@controllers/predictionController";

const predictionController = new PredictionController();

export async function GET(request: NextRequest) {
  try {
    // Get external predictions (scraped)
    const externalPredictions = await fetchPredictions();

    // Get internal predictions (MongoDB)
    const internalPredictions = await predictionController.getAllPredictions();

    // Merge both
    const allPredictions = [
      ...internalPredictions.map((p: any) => ({
        id: p._id.toString(),
        title: p.title,
        content: p.content,
        source: "internal",
        sport: p.sport,
        confidence: `${p.confidence}%`,
        status: p.status,
        match: p.matchDetails ? `${p.matchDetails.home} vs ${p.matchDetails.away}` : "TBD",
      })),
      ...externalPredictions.map((p: any, index: number) => ({
        id: `ext_${index}`,
        title: p.title,
        content: p.content || "External prediction analysis",
        source: "external",
        sport: p.sport || "Football",
        confidence: p.confidence || "70%",
        status: "active",
        match: "External Match",
      })),
    ];

    return NextResponse.json(allPredictions, { status: 200 });
  } catch (error) {
    console.error("Error fetching predictions:", error);
    return NextResponse.json(
      { error: "Failed to fetch predictions" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newPrediction = await predictionController.createPrediction(body);
    return NextResponse.json(newPrediction, { status: 201 });
  } catch (error: any) {
    console.error("Error creating prediction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create prediction" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;
    
    if (!id) {
      return NextResponse.json(
        { error: "ID is required for update" },
        { status: 400 }
      );
    }

    const updatedPrediction = await predictionController.updatePrediction(id, data);
    return NextResponse.json(updatedPrediction, { status: 200 });
  } catch (error: any) {
    console.error("Error updating prediction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update prediction" },
      { status: 400 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: "ID is required for deletion" },
        { status: 400 }
      );
    }

    await predictionController.deletePrediction(id);
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Error deleting prediction:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete prediction" },
      { status: 400 }
    );
  }
}