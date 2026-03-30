/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onSchedule } from "firebase-functions/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";

admin.initializeApp();

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

export const sendDailyPracticeReminders = onSchedule(
  "0 * * * *",
  async () => {
    logger.info("Starting daily practice reminders job");

    const now = new Date();

    // Query users with reminders enabled
    const usersSnapshot = await admin.firestore()
      .collection("users")
      .where("reminderSettings.enabled", "==", true)
      .get();

    let batch = admin.firestore().batch();
    const mailCollection = admin.firestore().collection("mail");
    let batchCount = 0;

    for (const doc of usersSnapshot.docs) {
      const userData = doc.data();
      const settings = userData.reminderSettings;

      if (!settings || !settings.timezone) continue;

      const userTimezone = settings.timezone;
      const preferredHour = settings.hour;

      // Get current hour in user's timezone
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          hour: "2-digit",
          hour12: false,
          timeZone: userTimezone,
        });

        const formattedHour = formatter.format(now);
        const currentLocalHour = parseInt(formattedHour, 10);

        if (currentLocalHour === preferredHour) {
          // Fetch user email from Auth
          const userRecord = await admin.auth().getUser(doc.id);
          if (userRecord.email) {
            const mailDocRef = mailCollection.doc();
            batch.set(mailDocRef, {
              to: userRecord.email,
              message: {
                subject: "Time to Practice Guitar! 🎸",
                text: "Hello! This is your daily reminder to pick up your " +
                  "guitar and practice those chords. Consistency is key!",
                html: `
                  <h2>Time to Practice! 🎸</h2>
                  <p>Hello!</p>
                  <p>This is your daily reminder to pick up your guitar and
                  practice.</p>
                  <p>Keep up the great work. Consistency is key to mastering
                  those chords!</p>
                  <p>Best,<br>The Chord Savvy Team</p>
                `,
              },
            });
            batchCount++;

            if (batchCount === 500) {
              await batch.commit();
              batch = admin.firestore().batch();
              batchCount = 0;
            }
          }
        }
      } catch (error) {
        logger.error(`Failed to process reminder for user ${doc.id}`, error);
      }
    }

    if (batchCount > 0) {
      await batch.commit();
    }

    logger.info("Finished daily practice reminders job");
  }
);
