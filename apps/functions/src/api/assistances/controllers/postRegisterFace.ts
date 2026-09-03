import {Request, Response} from "express";
// eslint-disable-next-line max-len
import {RekognitionClient, IndexFacesCommand} from "@aws-sdk/client-rekognition";


const rekognition = new RekognitionClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});

// eslint-disable-next-line max-len
export const postRegisterFace = async (req: Request, res: Response): Promise<void> => {
  try {
    const {userId, imageBase64} = req.body;

    if (!userId || !imageBase64) {
      res.status(400).json({error: "Faltan datos (userId o imageBase64)"});
      return;
    }

    const imageBuffer = Buffer.from(imageBase64, "base64");

    const command = new IndexFacesCommand({
      CollectionId: "vantoops-empleados",
      Image: {Bytes: imageBuffer},
      ExternalImageId: userId,
      MaxFaces: 1,
      QualityFilter: "AUTO",
    });

    const response = await rekognition.send(command);

    if (response.FaceRecords && response.FaceRecords.length > 0) {
      res.status(200).json({
        message: "Rostro registrado exitosamente",
        faceId: response.FaceRecords[0].Face?.FaceId,
      });
    } else {
      res.status(400).json({error: "No se detectó ningún rostro en la imagen"});
    }
  } catch (error) {
    console.error("Error registrando rostro:", error);
    // eslint-disable-next-line max-len
    res.status(500).json({error: "Error interno del servidor al contactar con AWS"});
  }
};
