import { Box, Container, Grid, makeStyles, Paper } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import SingleWord from '../SingleWord/SingleWord';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';


const useStyles = makeStyles({
    root: {

    },
    paper: {
        padding: "15px 15px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
    },
    box: {
        position: "fixed",
        right: "0",
        bottom: "0"
    },
    addButton: {
        padding: "12px 15px",
        backgroundColor: "tomato",
        borderRadius: "50%",
        cursor: "pointer",
        outline: "none",
        border: "none",
        color: "white",
        
    },
    search: {
        width: "100%",
        padding: "10px 5px",
        borderRadius: "8px",
        outline: "0",
    }



  });

const Home = () => {

    const [addedWord, setAddedWord] = useState("");
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [data, setData] = useState({})
    const [words, setWords] = useState([]);
    const appId = "f893adb3";
    const appKey = "afb1980e8c426dbf1677b0f69455eb2f";


    const handleSubmit = () => {

        const data = document.getElementById("word").value;
        setAddedWord(data.trim());
        setOpen(false);
    }
    
    useEffect(() => {
        if(addedWord){

            fetch(`https://cors-anywhere.herokuapp.com/https://od-api.oxforddictionaries.com/api/v2/entries/en-us/${addedWord}`, {
                headers: {
                    app_id: appId,
                    app_key: appKey
                }
            })
            .then(response => response.json())
            .then(data => {

                if(data){

                    const wordData = {
                        word: data.id,
                        category: data.results[0]?.lexicalEntries[0]?.lexicalCategory?.id,
                        definations:  data.results[0]?.lexicalEntries[0]?.entries[0]?.senses[0].definitions[0]
                    }

                    setData(wordData);
                }
            })
            .catch(error => alert("Data not found in dictionary"))
        }

    }, [addedWord])

    useEffect(() => {
        if(data.word){

            fetch('https://simple-vocabulary-web-app.herokuapp.com/addNewWord', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-type': 'application/json; charset=UTF-8',
                },
            })
            .then(response => response.json())
            .then(result => {
    
                if(result){
                    alert("Successfully words added");
                }
            })
        }

    }, [data])

    //Load all dictionary data
    useEffect(() => {

        fetch("https://simple-vocabulary-web-app.herokuapp.com/allWords")
        .then(response => response.json())
        .then(result => setWords(result))

    }, [data, addedWord])

    
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const [filterWords, setFilterWords] = useState([]);
    useEffect(() => {
        
        setFilterWords(words.filter(singleWord => singleWord.word?.toLowerCase().includes(search.toLowerCase().trim())));
    }, [search, words]);
    
    const classes = useStyles();
    return (
        <>
            <Container>
                <Grid container spacing={1}>
                    <Grid item xs={12} sm={12} md={12}>
                        <Paper className={classes.paper}>
                            <Box>
                                <h4>Vocabulary App</h4>
                            </Box>
                            <Box>
                                <input className={classes.search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder="Search" />
                            </Box>
                        </Paper>
                        <h2>Words list</h2>
                    </Grid>
                    
                    {
                        filterWords.map(singleWord => <SingleWord key={singleWord._id} singleWord={singleWord}></SingleWord>)
                    }
                    
                </Grid>
            </Container>
            <Box className={classes.box}>
                <button onClick={handleClickOpen} className={classes.addButton}><Add /> </button>
            </Box>

            
            <Box>
                <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">Add to dictionary</DialogTitle>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            id="word"
                            label="New word"
                            type="word"
                            name="word"
                            fullWidth
                        />
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                        </Button>
                        <Button onClick={handleSubmit} color="primary">
                            Submit
                        </Button>
                    </DialogActions>

                </Dialog>
            </Box>


        </>
    );
};

export default Home;