// const { db, storage } = require('./firebase');


// const usersRef = db.collection('users');
// const usersSnapshot = usersRef.get();

//   // Loop through each user
//   for (const userDoc of usersSnapshot.docs) {
//     const userData = userDoc.data();
//     const userEmail = userData.email;

//     //Get all course IDs for the user
//     const courseIds = userData.courses;

//     // Loop through each course ID
//     for (const courseId of courseIds) {

//       //Get course document for the course ID
//       const courseDoc = db.collection('courses').doc(courseId).get();
//       const courseData = courseDoc.data();

//       console.log("Course Data: " + courseData.courseName);

//       // Loop through each assignment ID
//       for (const assignmentId of courseData.assignments) {

//         //Get assignment document for the assignment ID
//         const assignmentDoc = db.collection('assignments').doc(assignmentId).get();
//         const assignmentData = assignmentDoc.data();

//         // Check if the assignment's deadline minus the reminderLeadTime is equal to the current time
//         const deadline = assignmentData.deadline;
//         const reminderLeadTime = assignmentData.reminderLeadTime;
//         const reminderTime = new Date(deadline.getTime() - reminderLeadTime * 24 * 60 * 1000);
//         const currentTime = new Date();
        
//         console.log("Current Time: " + currentTime.getTime());
//         console.log("Reminder Time: " + reminderTime.getTime());

//         if (currentTime.getTime() === reminderTime.getTime()) {
//           // Send email to user
//         //   const mailOptions = {
//         //     from: 'jobs.huzaifa.karbalai@gmail.com',
//         //     to: userEmail,
//         //     subject: `Reminder: Assignment "${assignmentData.title}" is due in ${reminderLeadTime} minutes`,
//         //     text: `Assignment "${assignmentData.title}" for course "${courseData.title}" is due at ${deadline}.`
//         //   };

//         //   await mailTransport.sendMail(mailOptions);
//           console.log(`Reminder email sent to ${userEmail} for assignment "${assignmentData.title}".`);
//         }
//       }
//     }
// }

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
  
  var deadline = "2023-05-03T20:56";
  deadline = new Date(deadline);
  const reminderLeadTime = convertReminderLeadTime("1 day") || 0;
  const reminderTime = new Date(deadline.getTime() - reminderLeadTime * 1000);
  const currentTime = new Date();
  
  reminderTime.setSeconds(0);
  currentTime.setSeconds(0);
  
  console.log("Reminder Time: " + reminderTime);
  console.log("Current Time: " + currentTime);
  
  console.log("Reminder Time Minutes: " + Math.round(reminderTime.getTime()/60000));
  console.log("Current Time Minutes: " + Math.round(currentTime.getTime()/60000));
  
  console.log("Is Equal? " + (Math.round(reminderTime.getTime()/60000) == Math.round(currentTime.getTime()/60000)));

  


