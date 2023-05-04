// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// const { collection, doc, getDocs, getDoc } = require('@firebase/firestore');

// admin.initializeApp();

// exports.checkAssignments = functions.pubsub.schedule('* * * * *').onRun(async (context) => {
//   const db = admin.firestore();
//   const querySnapshot = await db.collection("users").where("courses", "!=", []).get();
//   const users = querySnapshot.docs;

//   //const users = await getDocs(collection(db, "users"));
  
//   users.forEach(async (user) => {
//     const userDocRef = doc(db, 'users', user.id);
//     const userDocSnapshot = await getDoc(userDocRef);
//     const userCoursesArray = userDocSnapshot.get('courses');

//     for (const courseId of userCoursesArray) {
//         const courseDocRef = doc(db, 'courses', courseId);
//         const courseDocSnapshot = await getDoc(courseDocRef);
//         if (!courseDocSnapshot.exists) {
//             console.warn(`Course ${courseId} not found for user ${user.id}`);
//             continue;
//         }
      
//       const assignmentsArray = courseDocSnapshot.get('assignments');
      
//       for (const assignmentId of assignmentsArray) {
//         const assignmentDocRef = doc(db, 'assignments', assignmentId);
//         const assignmentDocSnapshot = await getDoc(assignmentDocRef);
//         if (!assignmentDocSnapshot.exists) {
//           console.warn(`Assignment ${assignmentId} not found for course ${courseId}`);
//           continue;
//         }
        
//         const data = assignmentDocSnapshot.data();
//         const deadline = data.deadline.toDate();
//         const reminderLeadTime = convertReminderLeadTime(data.reminderLeadTime) || 0;
//         const now = new Date();
        
//         if (now.getTime() === deadline.getTime() - reminderLeadTime * 60 * 1000) {
//           const email = userDocSnapshot.get('email');
//           console.log(`Sending reminder email to ${email}`);
//           // Implement email sending functionality here
//         }
//       }
//     }
//   });

//   return null;
// });

// function convertReminderLeadTime(reminderLeadTime) {
//   if (!reminderLeadTime) {
//     return 0;
//   }
  
//   const match = reminderLeadTime.match(/^(\d+)\s*(day|week)s?$/i);
//   if (!match) {
//     console.warn(`Invalid reminderLeadTime format: ${reminderLeadTime}`);
//     return 0;
//   }
  
//   const amount = parseInt(match[1]);
//   const unit = match[2].toLowerCase();
//   const minutes = unit === 'day' ? amount * 24 * 60 : amount * 7 * 24 * 60;
//   return minutes;
// }

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');

admin.initializeApp();
const firestore = admin.firestore();
const mailTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'roheelakhtar22@gmail.com',
    pass: 'tmvydebhvxadmrgq'
  }
});

exports.checkAssignments = functions.pubsub.schedule('every 1 minutes').onRun(async (context) => {
  console.log("I am running every 1 minute");

  // Get all users
  const usersRef = firestore.collection('users');
  const usersSnapshot = await usersRef.get();

  // Loop through each user
  for (const userDoc of usersSnapshot.docs) {
    const userData = userDoc.data();
    const userEmail = userData.email;

    //Get all course IDs for the user
    const courseIds = userData.courses;

    // Loop through each course ID
    for (const courseId of courseIds) {

      //Get course document for the course ID
      const courseDoc = await firestore.collection('courses').doc(courseId).get();
      const courseData = courseDoc.data();

      console.log("Course Data: " + courseData.courseName);

      // Loop through each assignment ID
      for (const assignmentId of courseData.assignments) {

        //Get assignment document for the assignment ID
        const assignmentDoc = await firestore.collection('assignments').doc(assignmentId).get();
        const assignmentData = assignmentDoc.data();

        // Check if the assignment's deadline minus the reminderLeadTime is equal to the current time
        const deadline = new Date(assignmentData.deadline);
        const reminderLeadTime =  convertReminderLeadTime(assignmentData.reminderLeadTime) || 0;
        var reminderDate = deadline.getTime() - 1 * 60 *60 * 1000;
        
        const reminderTime = new Date(reminderDate - reminderLeadTime * 1000);
        const currentTime = new Date();

        reminderTime.setSeconds(0);
        currentTime.setSeconds(0);

        console.log("Reminder Time: " + reminderTime);
        console.log("Current Time: " + currentTime);
        
        console.log("Reminder Time Minutes: " + Math.round(reminderTime.getTime()/60000));
        console.log("Current Time Minutes: " + Math.round(currentTime.getTime()/60000));

        if ((Math.round(reminderTime.getTime()/60000) == Math.round(currentTime.getTime()/60000))) {
          // Send email to user
          const mailOptions = {
            from: 'roheelakhtar22@gmail.com',
            to: userEmail,
            subject: `Reminder: ${assignmentData.assignmentName} is due in ${assignmentData.reminderLeadTime}`,
            text: `Hello ${userData.firstName}, \n\nReminder: An assignment of yours is due within ${assignmentData.reminderLeadTime}.\nAssignment : ${assignmentData.assignmentName}\nDue : ${new Date(assignmentData.deadline)}\nClass : ${courseData.courseName}`
          };

          await mailTransport.sendMail(mailOptions);
          console.log(`Reminder email sent to ${userEmail} for assignment "${assignmentData.title}".`);
        }
      }
    }
  }
});

function convertReminderLeadTime(reminderLeadTime) {
  if (!reminderLeadTime) {
    return 0;
  }

  const match = reminderLeadTime.match(/^(\d+)\s*(day|week)s?$/i);
  if (!match) {
    console.warn(`Invalid reminderLeadTime format: ${reminderLeadTime}`);
    return 0;
  }

  const amount = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  const seconds = unit == 'day' ? amount * 24 * 60 * 60 : amount * 7 * 24 * 60 * 60;

  return seconds;
}
