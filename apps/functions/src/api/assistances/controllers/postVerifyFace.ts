import {Request, Response} from "express";
// eslint-disable-next-line max-len
import {RekognitionClient, SearchFacesByImageCommand} from "@aws-sdk/client-rekognition";

const rekognition = new RekognitionClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// eslint-disable-next-line max-len
export const postVerifyFace = async (req: Request, res: Response): Promise<void> => {
  try {
    const {imageBase64} = req.body;

    if (!imageBase64) {
      res.status(400).json({error: "Falta la imagen en Base64"});
      return;
    }

    const imageBuffer = Buffer.from(imageBase64, "base64");

    const command = new SearchFacesByImageCommand({
      CollectionId: "vantoops-empleados",
      Image: {Bytes: imageBuffer},
      MaxFaces: 1,
      FaceMatchThreshold: 95,
    });

    const response = await rekognition.send(command);

    if (response.FaceMatches && response.FaceMatches.length > 0) {
      const match = response.FaceMatches[0];
      const matchedUserId = match.Face?.ExternalImageId;

      res.status(200).json({
        message: "Identidad confirmada. Asistencia registrada.",
        userId: matchedUserId,
        similarity: match.Similarity,
      });
    } else {
      res.status(401).json({error: "Rostro no reconocido en la base de datos"});
    }
  } catch (error) {
    console.error("Error verificando rostro:", error);
    res.status(500).json({error: "Error al procesar la biometría"});
  }
};
