// Import Material-UI components
import React, { useState, useEffect } from 'react';
import { Grid, Box, Typography, Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Paper } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EventIcon from '@mui/icons-material/Event';
import { auth, db } from '../lib/firebase';
import { doc, getDoc, addDoc, collection, updateDoc, arrayUnion} from 'firebase/firestore'; // Import the Firestore functions
import { Container} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Course from './courses/[courseName]';
import Link from 'next/link';

const Dashboard = () => {
  const [selectedOption, setSelectedOption] = useState('dashboard');
  const [userFullName, setUserFullName] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseInstructor, setCourseInstructor] = useState('');
  const [semester, setSemester] = useState('');
  const [userCourses, setUserCourses] = useState([]);
  const [open, setOpen] = useState(false); // State to manage the dialog open/
  

  const router = useRouter();

  // Event handler to close the dialog
  const handleClose = () => {
    setOpen(false);
  };



  useEffect(() => {
    // Fetch user's first name and last name from Firestore based on their userID
    const fetchUserData = async () => {
        try {
            // Check if currentUser is not null
            if (auth.currentUser) {
                const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
                if (userDoc.exists()) {
                    const { firstName, lastName } = userDoc.data();
                    setUserFullName(`${firstName} ${lastName}`);
                }
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };
    fetchUserData();
    fetchUserCourses();
}, [auth.currentUser, db, open]);


  const handleMenuItemClick = (option) => {
    setSelectedOption(option);
  };

  const handleDialogOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleCourseNameChange = (e) => {
    setCourseName(e.target.value);
  };

  const handleCourseInstructorChange = (e) => {
    setCourseInstructor(e.target.value);
  };

  const handleSemesterChange = (e) => {
    setSemester(e.target.value);
  };

  const handleAddCourse = async () => {
    try {
      // Add course details to "courses" collection
      const courseRef = await addDoc(collection(db, 'courses'), {
        courseName: courseName,
        courseInstructor: courseInstructor,
        semester: semester
      });
  
      // Get the course ID
      const courseId = courseRef.id;
  
      // Update "courses" array in user document with course ID reference
      const userDocRef = doc(db, 'users', auth.currentUser.uid); // Replace "userId" with the actual user ID
      await updateDoc(userDocRef, {
        courses: arrayUnion(courseId)
      });
  
      // Reset form values
      setCourseName('');
      setCourseInstructor('');
      setSemester('');
      
      handleDialogClose();
    } catch (error) {
      console.error('Error adding course:', error);
    }
  };

  const fetchUserCourses = async () => {
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid); // Replace "userId" with the actual user ID
      const userDocSnapshot = await getDoc(userDocRef);
      if (userDocSnapshot.exists()) {
        const userCoursesArray = userDocSnapshot.get('courses');
        const coursesData = [];
  
        // Fetch course details for each course ID reference
        for (const courseId of userCoursesArray) {
          const courseDocRef = doc(db, 'courses', courseId);
          const courseDocSnapshot = await getDoc(courseDocRef);
          if (courseDocSnapshot.exists()) {
            const courseData = courseDocSnapshot.data();
            const course = {
              courseId: courseId,
              courseName: courseData.courseName,
              courseInstructor: courseData.courseInstructor,
              semester: courseData.semester
            };
            coursesData.push(course);
          }
        }
  
        // Update userCourses state with fetched courses data
        setUserCourses(coursesData);
      }
    } catch (error) {
      console.error('Error fetching user courses:', error);
    }
  };

  return (
    <Box display="flex">
      {/* Side bar menu */}
      <Drawer variant="permanent" anchor="left">
        <Box p={2}>
          {/* User avatar and name */}
          <Box p={1}>
            <Grid container spacing={3} alignItems="center">
              {/* Replace this with your user avatar component */}
              <Grid item>
                <Box bgcolor="primary.main" width={48} height={48} borderRadius="50%" />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1">{userFullName}</Typography>
              </Grid>
            </Grid>
          </Box>
          {/* Menu options */}
          <List>
            <ListItemButton onClick={() => handleMenuItemClick('dashboard')}>
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" />
            </ListItemButton>
            <ListItemButton onClick={() => handleMenuItemClick('calendar')}>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText primary="Calendar" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>
      {/* Page content */}
      <Box p={2} ml={30}>
        {/* Render content based on selected menu option */}
        {selectedOption === 'dashboard' && (
            <Container maxWidth="sm">
              <Typography variant="h4" align="left" gutterBottom>
                Courses
              </Typography>
              <Button
                variant="contained"
                color="primary"
                size="large"
                // style={{ marginLeft: 'auto', display: 'block' }}
                onClick={handleDialogOpen}
              >
                New Course +
              </Button>
              <Grid container spacing={2} style={{ marginTop: '16px' }}>
                {/* Render course tiles */}
                {userCourses.map((course) => (
                  
                  <Grid item key={course.courseId} xs={12} sm={6} md={4} lg={3}>
                    {/* Set the desired width for different screen sizes */}
                    <Link href={`/courses/${course.courseId}`}>
                    <Button  style={{ height: '100%', width: '100%' }}>
                      {/* Use Button component to wrap the tile and add onClick event handler */}
                      <Paper elevation={3} style={{ height: '100%', width: '100%' }}>
                        {/* Set a fixed width for the Paper component */}
                        <Box height="100%" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                          <Typography variant="h6" align="center" gutterBottom style={{ overflowWrap: 'break-word' }}>
                            {course.courseName}
                          </Typography>
                          <Typography variant="subtitle1" align="center" gutterBottom style={{ wordWrap: 'break-word' }}>
                            {course.courseInstructor}
                          </Typography>
                          <Typography variant="subtitle2" align="center" gutterBottom style={{ wordWrap: 'break-word' }}>
                            {/* Use word-wrap property to ensure text content wraps within the tile */}
                            Semester: {course.semester}
                          </Typography>
                        </Box>
                      </Paper>
                    </Button>
                    </Link>
                  </Grid>
                ))}
              </Grid>
        </Container>
        )}
        {selectedOption === 'calendar' && (
          <Typography variant="h4">Calendar Page</Typography>
        )}
      </Box>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Add New Course</DialogTitle>
        <DialogContent>
          <Box sx={{ marginBottom: 1 }}>
            <TextField
              label="Course Name"
              fullWidth
              value={courseName}
              onChange={handleCourseNameChange}
            />
          </Box>
          <Box sx={{ marginBottom: 1 }}>
            <TextField
              label="Course Instructor"
              fullWidth
              value={courseInstructor}
              onChange={handleCourseInstructorChange}
            />
          </Box>
          <TextField
            label="Semester"
            fullWidth
            value={semester}
            onChange={handleSemesterChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddCourse} color="primary">
            Add Course
          </Button>
        </DialogActions>
        </Dialog>
    </Box>
  );
};

export default Dashboard;
