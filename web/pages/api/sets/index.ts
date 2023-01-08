import { NextApiRequest, NextApiResponse } from "next";
import { mongodbConnect } from "@lib";
import { Sets } from "@models";
import verifyIDToken from "lib/verifyIDToken";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method } = req;

  await mongodbConnect();

  const authResult = await verifyIDToken(req.headers.authorization);

  switch (method) {
    case "GET":
      try {
        const sets = await Sets.find({});

        res.status(200).json({ success: true, data: sets, authResult });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const set = await Sets.create(req.body);
        res.status(201).json({ success: true, data: set });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
