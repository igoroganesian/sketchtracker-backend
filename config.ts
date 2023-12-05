import dotenv from "dotenv";
dotenv.config();

// const SECRET_KEY = process.env.SECRET_KEY || "secret-dev";
// const PORT = process.env.PORT || "3000";

function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
      ? process.env.TEST_DATABASE_URL || "postgresql:///sketchtracker_test"
      : process.env.DATABASE_URL || "postgresql:///sketchtracker";
}

export { getDatabaseUri };
