import { Box, DialogContentText, Grid, IconButton, makeStyles, Paper } from '@material-ui/core';
import React, { useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Close } from '@material-ui/icons';


const useStyles = makeStyles({
    root: {

    },
    paper: {
        padding: "15px 15px",
        cursor: "pointer",
    },
    header: {
        display: "flex",
        justifyContent: "space-between"
    }



  });

const SingleWord = (props) => {
    const { _id, word, category, definations } = props.singleWord;
    const [SingleWordDetails, setSingleWordDetails] = useState({});

    const loadDetailsData = (id) => {

        fetch(`https://simple-vocabulary-web-app.herokuapp.com/wordById/${id}`)
        .then(response => response.json())
        .then(result => setSingleWordDetails(result))

    }

    const [open, setOpen] = useState(false);
    const handleClick = (id) => {

        loadDetailsData(id);
        setOpen(true);
    }

    const handleClose = () => {
        setOpen(false);
    };

    const classes = useStyles();
    return (
        <>
            <Grid item xs={12} sm={12} md={12}>
                <Box onClick={() => handleClick(_id)}>
                    <Paper className={classes.paper}>
                        <Box>
                            <h3>{word}</h3>
                            <p>({category}) {definations}</p>
                        </Box>
                    </Paper>
                </Box>
            </Grid>

            <Box>
                <Dialog fullScreen open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <Box className={classes.header}>
                        <DialogTitle id="form-dialog-title">{SingleWordDetails.word}</DialogTitle>
                        <IconButton onClick={handleClose}>
                            <Close />
                        </IconButton>
                    </Box>
                    
                    <DialogContent>
                        <DialogContentText>
                            ({SingleWordDetails.category}) {SingleWordDetails.definations}
                        </DialogContentText>
                    </DialogContent>
                </Dialog>
            </Box>
        </>
    );
};

export default SingleWord;