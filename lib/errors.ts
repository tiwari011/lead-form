export function getDatabaseErrorMessage(error: unknown) {
  if (!error || typeof error !== "object") {
    return "Unable to connect to MongoDB. Check your Atlas connection string and network access.";
  }

  const maybeError = error as { code?: string; message?: string; hostname?: string };

  if (maybeError.code === "ECONNREFUSED" || maybeError.message?.includes("ECONNREFUSED")) {
    return "MongoDB connection was refused. Check your internet connection, MongoDB Atlas network access, and connection string.";
  }

  if (maybeError.message?.includes("bad auth") || maybeError.message?.includes("Authentication failed")) {
    return "MongoDB authentication failed. Check the database username and password in .env.local.";
  }

  if (maybeError.message?.includes("querySrv")) {
    return "MongoDB SRV lookup failed. Check the Atlas connection string and network/DNS access.";
  }

  return "Unable to connect to MongoDB. Check your Atlas connection string and network access.";
}
