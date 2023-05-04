import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import {auth, db} from './firebase';
import { doc, getDoc, addDoc, collection, updateDoc, arrayUnion} from 'firebase/firestore';
import { Grid, Box, Typography, Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Paper } from '@mui/material';

export function CalendarPage() {
    const [events, setEvents] = useState([]);
  
    useEffect(() => {
        async function fetchEvents() {
            const eventsData = [];
          
            const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
            const userData = userDoc.data();
          
            // Get all course IDs for the user
            const courseIds = userData.courses;

            console.log("Course Ids " + courseIds)
          
            // Loop through each course ID
            for (const courseId of courseIds) {
          
              // Get course document for the course ID
              const courseDoc = await getDoc(doc(db, 'courses', courseId));
              const courseData = courseDoc.data();
          
                const assignmentIds = courseDoc.get('assignments');
                // Loop through each assignment ID
                for (const assignmentId of assignmentIds) {
          
                  // Get assignment document for the assignment ID
                  const assignmentDoc = await getDoc(doc(db, 'assignments', assignmentId));
                  const assignmentData = assignmentDoc.data();
          
                  // Add assignment details to eventsData
                  eventsData.push({
                    title: assignmentData.assignmentName,
                    start: assignmentData.deadline,
                    courseName: courseData.courseName,
                  });
                }
            }
          
            // Set the state to the fetched events data
            setEvents(eventsData);
          }
  
      fetchEvents();
    }, []);

  
    const eventContent = (arg) => {
      return (
        <Grid container direction="column">
          <Grid item>
            <Typography variant="caption">{arg.event.extendedProps.courseName}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="caption">{arg.event.title}</Typography>
          </Grid>
        </Grid>
      );
    };
  
    return (
      <FullCalendar
        eventDisplay='block'
        plugins={[dayGridPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventBackgroundColor='#09102E'
        eventContent={eventContent}
      />
    );
  }
  