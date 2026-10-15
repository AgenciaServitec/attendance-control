"use server";

import {
  RekognitionClient,
  CreateFaceLivenessSessionCommand,
  GetFaceLivenessSessionResultsCommand,
} from "@aws-sdk/client-rekognition";
import { STSClient, GetSessionTokenCommand } from "@aws-sdk/client-sts";

const region = process.env.AWS_REGION || "us-east-1";
const accessKeyId = process.env.AWS_ACCESS_KEY_ID || "";
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || "";

const rekognitionClient = new RekognitionClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

const stsClient = new STSClient({
  region,
  credentials: { accessKeyId, secretAccessKey },
});

export async function createLivenessSession() {
  try {
    const command = new CreateFaceLivenessSessionCommand({});
    const response = await rekognitionClient.send(command);

    // Obtenemos token temporal para que el cliente firme el WebSocket
    const stsCommand = new GetSessionTokenCommand({ DurationSeconds: 900 });
    const stsResponse = await stsClient.send(stsCommand);

    return {
      success: true,
      sessionId: response.SessionId,
      credentials: {
        accessKeyId: stsResponse.Credentials?.AccessKeyId || "",
        secretAccessKey: stsResponse.Credentials?.SecretAccessKey || "",
        sessionToken: stsResponse.Credentials?.SessionToken || "",
      },
    };
  } catch (error: any) {
    console.error("Error al crear sesión Liveness:", error);
    return { success: false, error: error.message };
  }
}

export async function getLivenessResult(sessionId: string) {
  try {
    const command = new GetFaceLivenessSessionResultsCommand({
      SessionId: sessionId,
    });

    const response = await rekognitionClient.send(command);
    const isLive = response.Confidence ? response.Confidence >= 70 : false;

    return {
      success: true,
      isLive,
      confidence: response.Confidence,
      referenceImage: response.ReferenceImage,
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
