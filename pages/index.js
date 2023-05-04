import Head from 'next/head'
import Link from 'next/link'
import { AppBar, Button, Container, Grid, Toolbar, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useRouter } from 'next/router'


const CustomAppBar = styled(AppBar)({
  backgroundColor: '#09102E'
})

const CustomButton = styled(Button)({
  color: '#fff',
  backgroundColor: '#09102E',
  '&:hover': {
    backgroundColor: '#09102E',
    opacity: 0.8
  }
})

const CustomTypography = styled(Typography)({
  color: '#09102E'
})

export default function Home() {
  const router = useRouter();
  return (
    
    <>
      <Head>
        <title>Self Study App</title>
        <meta name="description" content="A self study app for learners" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <CustomAppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Self Study
          </Typography>
          <Link href="/login" passHref>
            <Button color="inherit" variant="contained">
              <CustomTypography>
                Login
              </CustomTypography>
            </Button>
          </Link>
          <Link href="/register" passHref>
            <Button color="inherit" variant="contained" sx={{ ml: 2 }}>
              <CustomTypography>
                Register
              </CustomTypography>
            </Button>
          </Link>
        </Toolbar>
      </CustomAppBar>

      <Container sx={{ mt: 8 }}>
        <CustomTypography variant="h2" gutterBottom>
          Welcome to Self Study App
        </CustomTypography>
        <CustomTypography variant="body1" sx={{ mt: 4 }}>
          This is a self study app designed to help learners achieve their goals through self-directed learning. With our app, you can save your assignment details and deadlines, create notes for a particular course, and save all of your resources and view them later.
        </CustomTypography>
        <Link href="/register" passHref>
          <CustomButton variant="contained" sx={{ mt: 4 }} color="primary">Get Started</CustomButton>
        </Link>

        <CustomTypography variant="h3" align="center" sx={{ mt: 8, mb: 4 }}>
          Features
        </CustomTypography>
        <Typography variant="h5" align="center" sx={{ mb: 4, color: '#666' }}>
          The features make the difference
        </Typography>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={4}>
            <CustomTypography variant="h4" gutterBottom >
              Save Assignments
            </CustomTypography>
            <CustomTypography variant="body1">
              Never miss an assignment deadline again! Use our app to save all your assignment details and get email reminders as the deadline approaches.
            </CustomTypography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTypography variant="h4" gutterBottom >
              Create Notes
            </CustomTypography>
            <CustomTypography variant="body1">
              Keep all your course notes in one place! Use our app to create notes for each course and access them whenever you need to study.
            </CustomTypography>
          </Grid>
          <Grid item xs={12} sm={4}>
            <CustomTypography variant="h4" gutterBottom >
              Save Resources
            </CustomTypography>
            <CustomTypography variant="body1">
              Don't lose track of your course materials! Use our app to save all your resources (files, links, etc.) for each course and access them later.
            </CustomTypography>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}




