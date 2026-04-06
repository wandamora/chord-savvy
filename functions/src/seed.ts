import * as admin from "firebase-admin";

// Set emulator environment variables
process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
process.env.FIREBASE_AUTH_EMULATOR_HOST = "127.0.0.1:9099";
process.env.GCLOUD_PROJECT = "morawand-firebase-app";

admin.initializeApp({
  projectId: "morawand-firebase-app",
});

/**
 * Seeds the Firestore and Auth emulators with test data.
 */
async function seed() {
  const db = admin.firestore();
  const auth = admin.auth();

  console.log("Seeding data...");

  const users = [
    {
      uid: "user_nyc_9am",
      email: "nyc_9am@example.com",
      reminderSettings: {
        enabled: true,
        hour: 9,
        timezone: "America/New_York",
      },
    },
    {
      uid: "user_london_6pm",
      email: "london_6pm@example.com",
      reminderSettings: {
        enabled: true,
        hour: 18,
        timezone: "Europe/London",
      },
    },
    {
      uid: "user_tokyo_8am_disabled",
      email: "tokyo_8am_disabled@example.com",
      reminderSettings: {
        enabled: false,
        hour: 8,
        timezone: "Asia/Tokyo",
      },
    },
    {
      uid: "user_la_3pm",
      email: "la_3pm@example.com",
      reminderSettings: {
        enabled: true,
        hour: 15,
        timezone: "America/Los_Angeles",
      },
    },
  ];

  for (const u of users) {
    try {
      // Create Auth user
      try {
        await auth.createUser({
          uid: u.uid,
          email: u.email,
          password: "password123",
        });
        console.log(`Created Auth user: ${u.email}`);
      } catch (e) {
        const error = e as { code?: string };
        if (
          error.code === "auth/uid-already-exists" ||
          error.code === "auth/email-already-exists"
        ) {
          console.log(`Auth user already exists: ${u.email}`);
        } else {
          throw e;
        }
      }

      // Create Firestore doc
      await db.collection("users").doc(u.uid).set({
        favoriteSongs: [],
        knownChords: ["C", "G"],
        reminderSettings: u.reminderSettings,
      });
      console.log(`Created Firestore doc for: ${u.email}`);
    } catch (error) {
      console.error(`Failed to seed user ${u.email}:`, error);
    }
  }

  console.log("Seeding complete.");
}

seed().catch(console.error);
