"use server";

import {
  CreateCollectionCommand,
  IndexFacesCommand,
  RekognitionClient,
} from "@aws-sdk/client-rekognition";

const rekognition = new RekognitionClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

export async function enrollUserFace({
  userId,
  orgSlug,
  referenceImageBytes,
}: {
  userId: string;
  orgSlug: string;
  referenceImageBytes: Uint8Array | string;
}) {
  try {
    const collectionId = `org_${orgSlug}`;

    // 1. Asegurar que la colección de la empresa exista en AWS
    try {
      await rekognition.send(
        new CreateCollectionCommand({ CollectionId: collectionId }),
      );
    } catch (e: any) {
      // Ignorar si la colección ya existe (ResourceAlreadyExistsException)
    }

    // 2. Indexar la cara en Rekognition vinculando el userId
    const buffer =
      typeof referenceImageBytes === "string"
        ? Buffer.from(referenceImageBytes, "base64")
        : Buffer.from(referenceImageBytes);

    const indexCommand = new IndexFacesCommand({
      CollectionId: collectionId,
      Image: { Bytes: buffer },
      ExternalImageId: userId, // ID único del empleado
      MaxFaces: 1,
      QualityFilter: "HIGH",
    });

    const indexResponse = await rekognition.send(indexCommand);

    if (!indexResponse.FaceRecords || indexResponse.FaceRecords.length === 0) {
      return {
        success: false,
        error: "No se pudo detectar una cara clara para enrolar.",
      };
    }

    const faceId = indexResponse.FaceRecords[0].Face?.FaceId;

    // 3. Aquí puedes actualizar Supabase:
    // await supabase.from('users').update({ face_id: faceId, is_enrolled: true }).eq('id', userId)

    return {
      success: true,
      faceId,
    };
  } catch (error: any) {
    console.error("Error enrolando rostro:", error);
    return { success: false, error: error.message };
  }
}
