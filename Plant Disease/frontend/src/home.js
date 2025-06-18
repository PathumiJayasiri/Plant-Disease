
import { useState, useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import React from "react";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { Paper, CardActionArea, CardMedia, Grid, TableContainer, Table, TableBody, TableHead, TableRow, TableCell, Button, CircularProgress } from "@material-ui/core";
import image from "./bg.png";
import { DropzoneArea } from 'material-ui-dropzone';
import { common } from '@material-ui/core/colors';
import Clear from '@material-ui/icons/Clear';

const ColorButton = withStyles((theme) => ({
  root: {
    color: theme.palette.getContrastText(common.white),
    backgroundColor: common.white,
    '&:hover': {
      backgroundColor: '#ffffff7a',
    },
  },
}))(Button);

const axios = require("axios").default;

const useStyles = makeStyles((theme) => ({
  grow: { flexGrow: 1 },
  clearButton: {
    width: "100%",
    borderRadius: "12px",
    padding: "12px 24px",
    color: "#1b1b1b",
    backgroundColor: "#d8f3dc",
    fontSize: "18px",
    fontWeight: 700,
    '&:hover': {
      backgroundColor: "#b7e4c7",
    },
  },
  root: {
    maxWidth: 345,
    flexGrow: 1,
  },
  media: { height: 400 },
  paper: {
    padding: theme.spacing(2),
    margin: 'auto',
    maxWidth: 500,
  },
  gridContainer: {
    justifyContent: "center",
    padding: "4em 1em 0 1em",
  },
  mainContainer: {
    backgroundImage: `url(${image})`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    height: "93vh",
    marginTop: "8px",
  },
  imageCard: {
    margin: "auto",
    maxWidth: 420,
    backgroundColor: 'rgba(40, 158, 40, 0.85)', 
    boxShadow: '0px 12px 40px rgba(0,0,0,0.2)',
    borderRadius: '16px',
  },
  imageCardEmpty: { height: 'auto' },
  noImage: {
    margin: "auto",
    width: 400,
    height: "400 !important",
  },
  content: {
    padding: theme.spacing(3),
    textAlign: 'center',
  },
  input: { display: 'none' },
  uploadIcon: { background: 'white' },
  tableContainer: {
    backgroundColor: 'transparent',
    boxShadow: 'none',
  },
  table: { backgroundColor: 'transparent' },
  tableHead: { backgroundColor: 'transparent' },
  tableRow: { backgroundColor: 'transparent' },
  tableCell: {
    fontSize: '20px',
    backgroundColor: 'transparent',
    borderColor: 'transparent',
    color: '#1b1b1b',
    fontWeight: 600,
    padding: '8px 24px',
  },
  tableCell1: {
    fontSize: '16px',
    backgroundColor: 'rgba(88, 169, 88, 0.9)', 
   borderColor: 'transparent',
    color: '#1b1b1b',
    fontWeight: 'bold',
    padding: '8px 24px',
  },
  tableBody: {
    backgroundColor: 'rgba(93, 166, 93, 0.75)', 
  },
  text: {
    color: '#1b1b1b',
    textAlign: 'center',
  },
  buttonGrid: {
    maxWidth: "420px",
    width: "100%",
  },
  detail: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
    borderRadius: '12px',
    padding: theme.spacing(2),
  },
  appbar: {
    background: '#1b4332',
    boxShadow: 'none',
    color: 'white',
  },
  loader: { color: '#1b4332 !important' },
  someClass: {
    userSelect: 'none',
    '-webkit-user-select': 'none',
  },
}));

export const ImageUpload = () => {
  const classes = useStyles();
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [data, setData] = useState();
  const [image, setImage] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [error, setError] = useState(null);
  let confidence = 0;

  const clearData = () => {
    setData(null);
    setImage(false);
    setSelectedFile(null);
    setPreview(null);
    setError(null);
  };

  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl); 
  }, [selectedFile]);

  useEffect(() => {
    if (!preview) return;

    let isMounted = true;
    setIsloading(true);

    const sendFile = async () => {
      if (image) {
        let formData = new FormData();
        formData.append("file", selectedFile);
        try {
          let res = await axios({
            method: "post",
            url: process.env.REACT_APP_API_URL,
            data: formData,
          });
          if (res.status === 200 && isMounted) {
            setData(res.data);
            setError(null);
          }
        } catch (err) {
          console.error("Upload failed:", err);
          if (isMounted) {
            setError("Failed to upload image. Please try again.");
          }
        }
        if (isMounted) {
          setIsloading(false);
        }
      }
    };

    sendFile();

    return () => {
      isMounted = false;
    };
  }, [preview, image, selectedFile]);

  const onSelectFile = (files) => {
    if (!files || files.length === 0) {
      setSelectedFile(undefined);
      setImage(false);
      setData(undefined);
      setError(null);
      return;
    }
    setSelectedFile(files[0]);
    setData(undefined);
    setImage(true);
    setError(null);
  };

  if (data) {
    confidence = (parseFloat(data.confidence) * 100).toFixed(2);
  }

  return (
    <React.Fragment>
      <AppBar position="static" className={classes.appbar}>
       
      </AppBar>
      <Container maxWidth={false} className={classes.mainContainer} disableGutters={true}>
        <Grid
          className={classes.gridContainer}
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
          spacing={2}
        >
          <Grid item xs={12}>
            <Card className={`${classes.imageCard} ${!image ? classes.imageCardEmpty : ''}`}>
              {image && (
                <CardActionArea>
                  <CardMedia
                    className={classes.media}
                    image={preview}
                    component="img"
                    alt="Uploaded potato plant leaf image"
                  />
                </CardActionArea>
              )}
              {!image && (
                <CardContent className={classes.content}>
                  <DropzoneArea
                    acceptedFiles={['image/*']}
                    dropzoneText={"Drag and drop an image of a potato plant leaf to process"}
                    onChange={onSelectFile}
                    inputProps={{ 'aria-label': 'Upload an image of a potato plant leaf', title: 'Upload an image' }}
                  />
                </CardContent>
              )}
              {data && (
                <CardContent className={classes.detail}>
                  <TableContainer component={Paper} className={classes.tableContainer}>
                    <Table className={classes.table} size="small" aria-label="simple table">
                      <TableHead className={classes.tableHead}>
                        <TableRow className={classes.tableRow}>
                          <TableCell className={classes.tableCell1}>Label:</TableCell>
                          <TableCell align="right" className={classes.tableCell1}>Confidence:</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody className={classes.tableBody}>
                        <TableRow className={classes.tableRow}>
                          <TableCell component="th" scope="row" className={classes.tableCell}>
                            {data.class}
                          </TableCell>
                          <TableCell align="right" className={classes.tableCell}>{confidence}%</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              )}
              {isLoading && (
                <CardContent className={classes.detail}>
                  <CircularProgress color="secondary" className={classes.loader} />
                  <Typography className={classes.title} variant="h6" noWrap>
                    Processing
                  </Typography>
                </CardContent>
              )}
              {error && (
                <CardContent className={classes.detail}>
                  <Typography color="error" variant="body1">
                    {error}
                  </Typography>
                </CardContent>
              )}
            </Card>
          </Grid>
          {data && (
            <Grid item className={classes.buttonGrid}>
              <ColorButton
                variant="contained"
                className={classes.clearButton}
                color="primary"
                component="span"
                size="large"
                onClick={clearData}
                startIcon={<Clear fontSize="large" />}
              >
                Clear
              </ColorButton>
            </Grid>
          )}
        </Grid>
      </Container>
    </React.Fragment>
  );
};