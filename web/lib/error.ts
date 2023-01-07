import { FirebaseError } from "firebase/app";
import { ERROR_MESSAGES } from "@constants";

export default function errorMessage(err: any): any {
  if (err instanceof FirebaseError) {
    console.dir({ err });
    return (
      ERROR_MESSAGES[err.code as keyof typeof ERROR_MESSAGES] ||
      ERROR_MESSAGES["catchError"]
    );
  }

  return typeof err?.message === "string" ? err?.message : "Error occured";
}
