import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { db, storage } from '../../lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject} from "firebase/storage";
import { doc, getDoc, addDoc, collection, updateDoc, arrayUnion, deleteDoc, arrayRemove} from 'firebase/firestore';
import { IconButton, Table, TableHead, TableBody, TableCell, TableRow, TableContainer,Grid,Tab, Tabs, Box, Typography, Drawer, List, ListItem, ListItemIcon, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, TextField, TextareaAutosize, Button, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import UploadIcon from '@mui/icons-material/Upload';
import Link from 'next/link';

function Course() {
  const router = useRouter();
  const { courseName } = router.query;
  const [course, setCourse] = useState(null);
  const [selectedTab, setSelectedTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [assignmentName, setAssignmentName] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [editedAssignment, setEditedAssignment] = useState({});
  const [editingOpen, setEditingOpen] = useState(false);
  const [deleteOpen , setDeleteOpen ] = useState(false);
  const [notesOpen , setNotesOpen ] = useState(false);
  const [notesTitle, setNotesTitle] = useState("");
  const [notesDescription, setNotesDescription] = useState("");
  const [notes, setNotes] = useState([]);
  const [notesViewOpen, setNotesViewOpen] = useState(false);
  const [editedNote, setEditedNote] = useState({});
  const [notesEditOpen, setNotesEditOpen] = useState(false);
  const [notesDeleteOpen, setNotesDeleteOpen] = useState(false);
  const [resourceOpen, setResourceOpen] = useState(false);
  const [file, setFile] = useState("");
  const [percent, setPercent] = useState(0);
  const [resources, setResources] = useState([]);
  const [editedResource, setEditedResource] = useState({});
  const [resourceDeleteOpen, setResourceDeleteOpen] = useState(false);
  const [reminderLeadTime, setReminderLeadTime] = useState("");
  const [reminderLeadTime1, setReminderLeadTime1] = useState("");
  const [reminderLeadTime2, setReminderLeadTime2] = useState("");

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const addAssignment = async () => {
    try {
      var assignmentRef;
        assignmentRef = await addDoc(collection(db, 'assignments'), {
          assignmentName: assignmentName,
          deadline: deadline,
          status: status,
          reminderLeadTime: reminderLeadTime
        });
      

      // Get the assignment ID
      const assignmentId = assignmentRef.id;
  
      // Update "assignments" array in courses document with assignment ID reference
      const coursesDocRef = doc(db, 'courses', courseName);
      await updateDoc(coursesDocRef, {
        assignments: arrayUnion(assignmentId)
      });
  
      // Reset form values  
      setAssignmentName('');
      setDeadline('');
      setStatus(''); 
      setReminderLeadTime('')
      setReminderLeadTime1('')
      setReminderLeadTime2('')

      fetchAssignments();
      setOpen(false);
    } catch {
      console.error('Error adding assignment:', error);
    }
  }

  const deleteAssignment = async () => {
    try {
      const assignmentRef = doc(db, 'assignments', editedAssignment.assignmentId);
      await deleteDoc(assignmentRef);
      const coursesDocRef = doc(db, 'courses', courseName);
      await updateDoc(coursesDocRef, {
        assignments: arrayRemove(editedAssignment.assignmentId)
      });

      fetchAssignments();
      setDeleteOpen(false);
    
    } catch(error) {
      console.error("Error deleting assignment:", error);
    }
  }

  const updateAssignment = async () => {
    try {
      var assignmentRef = doc(db, 'assignments', editedAssignment.assignmentId);
    
      await updateDoc(assignmentRef, {
        assignmentName: editedAssignment.assignmentName,
        deadline: editedAssignment.deadline,
        status: editedAssignment.status,
        reminderLeadTime: editedAssignment.reminderLeadTime
      });
     
      fetchAssignments();
      setEditingOpen(false);
    } catch (error) {
      console.error('Error updating assignment:', error);
    }
  };

  const fetchAssignments = async () => {
    try {
      const coursesDocRef = doc(db, 'courses', courseName); // Replace "userId" with the actual user ID
      const courseDocSnapshot = await getDoc(coursesDocRef);
      if (courseDocSnapshot.exists()) {
        const assignmentsArray = courseDocSnapshot.get('assignments');
        const assignmentsData = [];
  
        // Fetch course details for each course ID reference
        for (const assignmentId of assignmentsArray) {
          const assignmentDocRef = doc(db, 'assignments', assignmentId);
          const assignmentDocSnapshot = await getDoc(assignmentDocRef);
          if (assignmentDocSnapshot.exists()) {
            const assignmentData = assignmentDocSnapshot.data();
            var assignment;
              assignment = {
                assignmentId: assignmentId,
                assignmentName: assignmentData.assignmentName,
                deadline: assignmentData.deadline,
                status: assignmentData.status,
                reminderLeadTime: assignmentData.reminderLeadTime,
              };
           
            assignmentsData.push(assignment);
          }
        }
  
        // Update userCourses state with fetched courses data
        setAssignments(assignmentsData);
      }
    } catch (error) {
      console.error('Error fetching assignments:', error);
    }
  };
  
  const handleReminderLeadTimeChange = (e) => {
    setReminderLeadTime(e.target.value);
  }

  const handleReminderLeadTime1Change = (e) => {
    setReminderLeadTime1(e.target.value);
  }

  const handleReminderLeadTime2Change = (e) => {
    setReminderLeadTime2(e.target.value);
  }
  
  const handleEditedReminderLeadTimeChange = (e) => {
    setEditedAssignment({
      ...editedAssignment,
      reminderLeadTime: e.target.value
    });
  }

  const handleEditedReminderLeadTime1Change = (e) => {
    setEditedAssignment({
      ...editedAssignment,
      reminderLeadTime1: e.target.value
    });
  }

  const handleEditedReminderLeadTime2Change = (e) => {
    setEditedAssignment({
      ...editedAssignment,
      reminderLeadTime2: e.target.value
    });
  }

  const handleAssignmentNameChange = (e) => {
    setAssignmentName(e.target.value);
  };

  const handleDeadlineChange = (e) => {
    setDeadline(e.target.value);
  };

  const handleStatusChange = (e) => {
    setStatus(e.target.value);
  };

  const handleClose = (e) => {
    setDeleteOpen(false);
  };

  const handleEditedAssignmentNameChange = (e) => {
    setEditedAssignment({
      ...editedAssignment,
      assignmentName: e.target.value
    });
  };
  
  const handleEditedDeadlineChange = (e) => {
    setEditedAssignment({
      ...editedAssignment,
      deadline: e.target.value
    });
  };
  
  const handleEditedStatusChange = (e) => {
    setEditedAssignment({
      ...editedAssignment,
      status: e.target.value
    });
  };

  const addNotes = async () => {
    try {
      const notesRef = await addDoc(collection(db, 'notes'), {
        notesTitle: notesTitle,
        notesDescription: notesDescription
      });

      // Get the assignment ID
      const noteId = notesRef.id;
  
      // Update "notes" array in courses document with notes ID reference
      const coursesDocRef = doc(db, 'courses', courseName);
      await updateDoc(coursesDocRef, {
        notes: arrayUnion(noteId)
      });
  
      // Reset form values  
      setNotesTitle('');
      setNotesDescription('');
      
      fetchNotes();
      setNotesOpen(false);
    } catch {
      console.error('Error adding notes:', error);
    }
    
  };

  const updateNotes = async () => {
    try {
      const noteRef = doc(db, 'notes', editedNote.noteId);
      await updateDoc(noteRef, {
        notesTitle: editedNote.notesTitle,
        notesDescription: editedNote.notesDescription,
      });
  
      fetchNotes();
      setNotesEditOpen(false);
    } catch (error) {
      console.error('Error updating notes:', error);
    }
  };

  const deleteNote = async () => {
    try {
      const noteRef = doc(db, 'notes', editedNote.noteId);
      await deleteDoc(noteRef);
      const coursesDocRef = doc(db, 'courses', courseName);
      await updateDoc(coursesDocRef, {
        notes: arrayRemove(editedNote.noteId)
      });

      fetchNotes();
      setNotesDeleteOpen(false);
    
    } catch(error) {
      console.error("Error deleting note:", error);
    }
  }

  const handleEditedNoteTitleChange = (e) => {
    setEditedNote({
      ...editedNote,
      notesTitle: e.target.value
    });
  };

  const handleEditedNoteDecriptionChange = (e) => {
    setEditedNote({
      ...editedNote,
      notesDescription: e.target.value
    });
  };
  const handleDeleteClose = (e) => {
    setNotesDeleteOpen(false);
  };

  const fetchNotes = async () => {
    try {
      const coursesDocRef = doc(db, 'courses', courseName); // Replace "userId" with the actual user ID
      const courseDocSnapshot = await getDoc(coursesDocRef);
      if (courseDocSnapshot.exists()) {
        const notesArray = courseDocSnapshot.get('notes');
        const notesData = [];
  
        // Fetch course details for each course ID reference
        for (const noteId of notesArray) {
          const noteDocRef = doc(db, 'notes', noteId);
          const noteDocSnapshot = await getDoc(noteDocRef);
          if (noteDocSnapshot.exists()) {
            const noteData = noteDocSnapshot.data();
            const note = {
              noteId: noteId,
              notesTitle: noteData.notesTitle,
              notesDescription: noteData.notesDescription,
            };
            notesData.push(note);
          }
        }
  
        // Update userCourses state with fetched courses data
        setNotes(notesData);
      }
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

  function handleChange(event) {
    setFile(event.target.files[0]);
  }

  const uploadFile = () => {
    if (!file) {
      alert("Please upload an image first!");
    }
    const storageRef = ref(storage, `/files/${file.name}`);
    // progress can be paused and resumed. It also exposes progress updates.
    // Receives the storage reference and the file to upload.
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
      const percent = Math.round(
      (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
      
      // update progress
      setPercent(percent);
      },
      (err) => console.log(err),
      () => {
      // download url
      getDownloadURL(uploadTask.snapshot.ref).then(async (url) => {

        const resourcesRef = await addDoc(collection(db, 'resources'), {
          fileName: file.name,
          url: url,
        });

        // Get the assignment ID
        const resourceId = resourcesRef.id;
  
        const coursesDocRef = doc(db, 'courses', courseName);
        await updateDoc(coursesDocRef, {
            resources: arrayUnion(resourceId)
        });
        fetchResources();
      });
      }
      );
      
      setPercent(0);
      //setResourceOpen(false);
      
  };

  const deleteFile = async () => {
    try {
      const resourceRef = doc(db, 'resources', editedResource.resourceId);
      await deleteDoc(resourceRef);
      const coursesDocRef = doc(db, 'courses', courseName);
      await updateDoc(coursesDocRef, {
        resources: arrayRemove(editedResource.resourceId)
      });

      // Delete the file from Firebase Storage
      const storageRef = ref(storage, `files/${editedResource.fileName}`);
      await deleteObject(storageRef);

      fetchResources();
      setResourceDeleteOpen(false);


    
    } catch(error) {
      console.error("Error deleting note:", error);
    }
  }

  const handleUploadClose = (e) => {
    fetchResources();
    setResourceOpen(false)
  };

  const handleResourceDeleteClose = (e) => {
    setResourceDeleteOpen(false);
  };

  const fetchResources = async () => {
    try {
      const coursesDocRef = doc(db, 'courses', courseName); // Replace "userId" with the actual user ID
      const courseDocSnapshot = await getDoc(coursesDocRef);
      if (courseDocSnapshot.exists()) {
        const resourcesArray = courseDocSnapshot.get('resources');
        const resourcesData = [];
  
        // Fetch course details for each course ID reference
        for (const resourceId of resourcesArray) {
          const resourceDocRef = doc(db, 'resources', resourceId);
          const resourceDocSnapshot = await getDoc(resourceDocRef);
          if (resourceDocSnapshot.exists()) {
            const resourceData = resourceDocSnapshot.data();
            const resource = {
              resourceId: resourceId,
              fileName: resourceData.fileName,
              url: resourceData.url,
            };
            resourcesData.push(resource);
          }
        }
  
        // Update userCourses state with fetched courses data
        setResources(resourcesData);
      }
    } catch (error) {
      console.error('Error fetching resources:', error);
    }
  };



  useEffect(() => {
    async function fetchCourse() {
      const courseRef = doc(db, "courses", courseName);
      const docSnap = await getDoc(courseRef);  
      setCourse(docSnap.data());
    }

    if (courseName) {
      fetchCourse();
      fetchResources();
      fetchAssignments();
      fetchNotes();
    }
    
  }, [courseName, open]);

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <Box p={2} >
        <Box textAlign="center">
        <Typography variant="h4" mb={2} sx={{color:"#09102E"}}> Course: {course.courseName} </Typography>
        <Typography variant="h6" mb={2} sx={{color:"#09102E"}}> Instructor: {course.courseInstructor} </Typography>
        <Typography variant="h6" mb={5} sx={{color:"#09102E"}}> Semester: {course.semester} </Typography>
        {/* <h1>Course: {course.courseName}</h1>
        <p>Instructor: {course.courseInstructor}</p>
        <p>Semester: {course.semester}</p> */}
        {/* display the course details */}
        </Box>

        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          aria-label="Course tabs"
          // sx={{ "& .Mui-selected": { color: "#09102E" } }}
        >
          <Tab label="Assignments" sx={{ "&.Mui-selected": { backgroundColor: "#09102E"} }} />
          <Tab label="Notes" sx={{ "&.Mui-selected": { backgroundColor: "#09102E" } }} />
          <Tab label="Resources" sx={{ "&.Mui-selected": { backgroundColor: "#09102E" } }} />
        </Tabs>



      {selectedTab === 0 && (
        // Assignments view
        <div>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{ float: "right" }} sx={{ ml: 'auto', mr: 2, mt: 2, bgcolor: "#09102E"}} onClick={() =>{ setOpen(true)}}>New Assignment</Button>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Assignment Name</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {assignments.map((assignment) => (
                <TableRow key={assignment.id}>
                  <TableCell>{assignment.assignmentName}</TableCell>
                  <TableCell>{new Date(assignment.deadline).toLocaleString().replace('T', ' ')}</TableCell>
                  <TableCell>{assignment.status}</TableCell>
                  <TableCell>                    
                    <IconButton style={{float: "right"}} onClick={() => {setEditedAssignment(assignment); setEditingOpen(true)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton style={{float: "right"}} onClick = {() => {setDeleteOpen(true); setEditedAssignment(assignment)}}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </TableContainer>

        <Dialog open={editingOpen} onClose={() => setEditingOpen(false)}>
        <DialogTitle>{"Edit Assignment"}</DialogTitle>
        <DialogContent>
            <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Assignment Name"
            type="text"
            fullWidth
            value={editedAssignment.assignmentName}
            onChange={handleEditedAssignmentNameChange}
            />

            <TextField
              margin="dense"
              id="deadline"
              label="Deadline"
              type="datetime-local"
              defaultValue={new Date()}
              InputLabelProps={{
                shrink: true,
              }}
              fullWidth
              value={editedAssignment.deadline}
              onChange={handleEditedDeadlineChange}
            />
            <TextField
            margin="dense"
            id="status"
            select
            fullWidth
            label="Status"
            defaultValue= {"In Progress"}
            value={editedAssignment.status}
            InputLabelProps={{ shrink: true }}
            onChange={handleEditedStatusChange}
            SelectProps={{
                native: true,
            }}
            >
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            </TextField>

              <TextField
              margin="dense"
              id="reminderLeadTime"
              select
              fullWidth
              defaultValue={12}
              value={editedAssignment.reminderLeadTime}
              onChange={handleEditedReminderLeadTimeChange}
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{ shrink: true }}
              label="Reminder Lead Time Before Deadline"
            >
              <option value={"2 day"}>2 days before</option>
              <option value={"1 week"}>1 week before</option>
            </TextField>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setEditingOpen(false)}>Cancel</Button>
            <Button onClick={() => updateAssignment()} color="primary">Save</Button>
        </DialogActions>
        </Dialog>

      <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{"Add New Assignment"}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Assignment Name"
          type="text"
          fullWidth
          value={assignmentName}
          onChange={handleAssignmentNameChange}
        />
        <TextField
          margin="dense"
          id="deadline"
          label="Deadline"
          type="datetime-local"
          defaultValue={new Date()}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
          value={deadline}
          onChange={handleDeadlineChange}
        />
        <TextField
          margin="dense"
          id="status"
          select
          fullWidth
          defaultValue={"In Progress"}
          value={status}
          onChange={handleStatusChange}
          SelectProps={{
            native: true,
          }}
          InputLabelProps={{
            shrink: true,
          }}
          label = "Status"
        >
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </TextField>

          <TextField
          margin="dense"
          id="reminderLeadTime"
          select
          fullWidth
          defaultValue={12}
          value={reminderLeadTime}
          onChange={handleReminderLeadTimeChange}
          SelectProps={{
            native: true,
          }}
          InputLabelProps={{ shrink: true }}
          label="Reminder Lead Time Before Deadline"
        >
              <option value={"2 day"}>2 days before</option>
              <option value={"1 week"}>1 week before</option>
        </TextField>

      </DialogContent>
  <DialogActions>
    <Button onClick={() => setOpen(false)}>Cancel</Button>
    <Button onClick={() => addAssignment()} color="primary">Save</Button>
  </DialogActions>
</Dialog>

        <Dialog
        open={deleteOpen}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
      <DialogTitle id="alert-dialog-title">Delete Assignment</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this assignment?
        </DialogContentText>
        <DialogContentText paddingTop={2}>
          {editedAssignment.assignmentName}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDeleteOpen(false)} color="primary">
          No
        </Button>
        <Button onClick={() => deleteAssignment()} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
        </div>
      )}

      {selectedTab === 1 && (
        // Notes view
        <div>
          <Button variant="contained" color="primary" startIcon={<AddIcon />} style={{ float: "right" }} sx={{ ml: 'auto', mr: 2, mt: 2, bgcolor: "#09102E" }} onClick={() => setNotesOpen(true)} >New Notes</Button>
          
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Notes Title</TableCell>
                  {/* <TableCell>Notes Description</TableCell> */}
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {notes.map((note) => (
                <TableRow key={note.notesId}>
                  <TableCell>{note.notesTitle}</TableCell>
                  {/* <TableCell  style={{ wordBreak: "break-word" }}>{note.notesDescription}</TableCell> */}
                  <TableCell>  
                    <IconButton style={{float: "right"}} onClick={()=> {setNotesDeleteOpen(true); setEditedNote(note)}}>
                      <DeleteIcon />
                    </IconButton>
                    <IconButton style={{float: "right"}} onClick={()=> {setNotesEditOpen(true); setEditedNote(note)}}>
                      <EditIcon />
                    </IconButton>
                    <IconButton style={{float: "right"}} onClick={()=> {setNotesViewOpen(true); setEditedNote(note)}}>
                      <VisibilityIcon />
                    </IconButton>   
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </TableContainer>

        <Dialog open={notesOpen} onClose={() => setNotesOpen(false)} fullScreen>
        <DialogTitle>New Notes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="notesTitle"
            label="Notes Title"
            type="text"
            fullWidth
            value={notesTitle}
            onChange={(e) => setNotesTitle(e.target.value)}
          />
          <TextField
            minRows={10}
            multiline
            autoFocus
            margin="dense"
            id="notesDescription"
            label="Notes Description"
            type="text"
            fullWidth
            value={notesDescription}
            onChange={(e) => setNotesDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesOpen(false)}>Cancel</Button>
          <Button onClick={addNotes} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={notesViewOpen} onClose={() => setNotesViewOpen(false)} fullScreen>
        <DialogTitle>Notes</DialogTitle>
        <DialogContent>
          <TextField
            InputProps={{
              readOnly: true,
            }}
            autoFocus
            margin="dense"
            id="notesTitle"
            label="Notes Title"
            type="text"
            fullWidth
            value={editedNote.notesTitle}
            onChange={(e) => setNotesTitle(e.target.value)}
          />
          <TextField
            minRows={10}
            multiline
            autoFocus
            InputProps={{
              readOnly: true,
            }}
            margin="dense"
            id="notesDescription"
            label="Notes Description"
            type="text"
            fullWidth
            value={editedNote.notesDescription}
            onChange={(e) => setNotesDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesViewOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={notesEditOpen} onClose={() => setNotesEditOpen(false)} fullScreen>
        <DialogTitle>Notes</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="notesTitle"
            label="Notes Title"
            type="text"
            fullWidth
            value={editedNote.notesTitle}
            onChange={handleEditedNoteTitleChange}
          />
          <TextField
            minRows={10}
            multiline
            autoFocus
            margin="dense"
            id="notesDescription"
            label="Notes Description"
            type="text"
            fullWidth
            value={editedNote.notesDescription}
            onChange={handleEditedNoteDecriptionChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesEditOpen(false)}>Cancel</Button>
          <Button onClick={updateNotes} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={notesDeleteOpen}
        onClose={handleDeleteClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        >
      <DialogTitle id="alert-dialog-title">Delete Note</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this note?
        </DialogContentText>
        <DialogContentText paddingTop={2}>
          {editedNote.notesTitle}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setNotesDeleteOpen(false)} color="primary">
          No
        </Button>
        <Button onClick={() => deleteNote()} color="primary" autoFocus>
          Yes
        </Button>
      </DialogActions>
    </Dialog>
        </div>
      )}

      {selectedTab === 2 && (
        // Resources view
        <div>
        <Button variant="contained" component="label" startIcon={<UploadIcon />} style={{ float: "right" }} sx={{ ml: 'auto', mr: 2, mt: 2, bgcolor: "#09102E" }} onClick={() => {setResourceOpen(true); setPercent(0); console.log(resources)}}>
          Upload Resource
        </Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>File Name</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
              {resources.map((resource) => (
                <TableRow key={resource.resourceId}>
                  <TableCell>{resource.fileName}</TableCell>
                  <TableCell>  
                    <IconButton style={{float: "right"}} onClick={() => {setResourceDeleteOpen(true); setEditedResource(resource);}}>
                      <DeleteIcon />
                    </IconButton>
                    <Link href= {resource.url}>
                      <IconButton style={{float: "right"}}>
                        <VisibilityIcon />
                      </IconButton>   
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            </Table>
          </TableContainer>

          <Dialog open={resourceOpen} onClose={handleUploadClose} fullWidth>
            <DialogTitle>Upload Resource</DialogTitle>
              
            <center>
              <input type="file" onChange={handleChange} accept="/image/*" />
              <button onClick={uploadFile}>Upload</button>
              <p>{percent} % done</p>
            </center>
            <DialogActions>
              <Button onClick={() => setResourceOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <Dialog
              open={resourceDeleteOpen}
              onClose={handleResourceDeleteClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
              >
            <DialogTitle id="alert-dialog-title">Delete Note</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure you want to delete this resource?
              </DialogContentText>
              <DialogContentText paddingTop={2}>
                {editedResource.fileName}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setResourceDeleteOpen(false)} color="primary">
                No
              </Button>
              <Button onClick={() => deleteFile()} color="primary" autoFocus>
                Yes
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </Box>
  );
}

export default Course;
