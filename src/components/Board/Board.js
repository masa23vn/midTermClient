import React, { useState, useEffect } from 'react';
import {
    useParams,
    useHistory,
} from "react-router-dom";
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import DoneIcon from '@material-ui/icons/Done';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import { DragDropContext } from 'react-beautiful-dnd';
import Alert from '@material-ui/lab/Alert';

import socket from "../../utils/socket.service";
import Column from "./Column";

const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        overflowY: 'auto',
        marginTop: '20px',
    },
    heroContent: {
        margin: "60px 0px 0px 0px",
    },
    heroTitle: {
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
    },
    heroButtonsContainer: {
        marginBottom: "30px",
    },
    heroButtons: {
        minWidth: "120px",
    },

    editAction: {
        marginBottom: '-25px'
    },
    columnGrid: {
        paddingTop: "50px",
        paddingBottom: "30px",
    },
}));

export default function Board() {
    const classes = useStyles();
    const history = useHistory();
    const ID = useParams().id;
    const [board, setBoard] = useState();   // data board

    const [editedName, setEditedName] = useState();   // new name for board
    const [isEdit, setIsEdit] = useState(false);

    const [isCopied, setIsCopied] = useState(false);    // display alert when copy url

    useEffect(() => {
        socket.emit("alert_board", ID);
        const getAddress = "get_board_" + ID;
        socket.on(getAddress, setBoard);

        const changeAddress = "change_board_" + ID;
        socket.on(changeAddress, () => {
            socket.emit("alert_board", ID);
        });

        return () => {
            socket.off(getAddress);
            socket.off(changeAddress);
        }
    }, [ID, history])

    // edit name
    const onChangeName = (e) => {
        setEditedName(e.target.value);
    }

    const startEditName = () => {
        setEditedName(board[0].name);
        setIsEdit(true);
    }

    const finishEditName = async () => {
        if (editedName === "") {
            setEditedName(board[0].name);
            setIsEdit(false);
        }
        else {
            try {
                socket.emit("change_name", { ID: ID, newName: editedName });
                board[0].name = editedName;
                setBoard(board);
                setIsEdit(false);
            }
            catch (error) {
                setEditedName(board[0].name);
                setIsEdit(false);
            }
        }
    }

    const closeEditName = () => {
        setEditedName(board[0].name);
        setIsEdit(false);
    }

    // copy link
    const copyLink = () => {
        const link = window.location.href;

        // create temporary DOM to hold link, copy to clipboard then remove it
        const dummy = document.createElement('input');
        dummy.value = link;
        document.body.appendChild(dummy);
        dummy.select();
        document.execCommand('copy');
        document.body.removeChild(dummy);

        // show alert
        setIsCopied(true);
    }

    const closeCopy = () => {
        setIsCopied(false);
    }

    // update card
    const changeColumn = (column) => {
        const i = board[0].column.findIndex((e) => { return e.ID === column.ID })
        const newBoard = board.slice();
        newBoard[0].column[i] = column;
        setBoard(newBoard);
    }

    // drag drop
    const onDragEnd = (result) => {
        const { destination, source } = result;

        if (!destination) {
            return;
        }

        if (destination.droppableId === source.droppableId && destination.index === source.index) {
            return;
        }

        if (source.droppableId === destination.droppableId) {
            // get start column
            const i = board[0].column.findIndex((e) => { return e.ID.toString() === source.droppableId })
            const column = board[0].column[i];

            // get select card
            const tempCard = column.card[source.index];

            column.card.splice(source.index, 1);                      // delete at old pos
            column.card.splice(destination.index, 0, tempCard);    // insert to new pos

            const newBoard = board.slice();
            newBoard[0].column[i] = column;
            setBoard(newBoard);

            socket.emit("move_card", { cardID: tempCard.ID, boardID: ID, columnID: column.ID, from: source.index + 1, to: destination.index + 1 });
        }
        else {
            // get start column
            const i1 = board[0].column.findIndex((e) => { return e.ID.toString() === source.droppableId })
            const startCol = board[0].column[i1];

            // get finish column
            const i2 = board[0].column.findIndex((e) => { return e.ID.toString() === destination.droppableId })
            const desCol = board[0].column[i2];

            // get select card
            const tempCard = startCol.card[source.index];

            startCol.card.splice(source.index, 1);                      // delete at old pos
            desCol.card.splice(destination.index, 0, tempCard);    // insert to new pos

            const newBoard = board.slice();
            newBoard[0].column[i1] = startCol;
            newBoard[0].column[i2] = desCol;
            setBoard(newBoard);

            socket.emit("move_card_2_col", { cardID: tempCard.ID, boardID: ID, startColumnID: startCol.ID, desColumnID: desCol.ID, from: source.index + 1, to: destination.index + 1 });
        }
    }
    return (
        <React.Fragment>
            <main className={classes.content}>
                {/* Hero unit */}
                <div className={classes.heroContent}>
                    <Container maxWidth="sm" className={classes.heroTitle}>
                        {isEdit ?
                            <Box>
                                <TextField
                                    autoFocus
                                    required
                                    margin="dense"
                                    id="name"
                                    value={editedName}
                                    type="text"
                                    onChange={(value) => onChangeName(value)}
                                />
                                <IconButton onClick={finishEditName} color="primary" aria-label="edit" component="span" size="small" className={classes.editAction}>
                                    <DoneIcon />
                                </IconButton>
                                <IconButton onClick={closeEditName} color="primary" aria-label="cancel" component="span" size="small" className={classes.editAction}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                            :
                            <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                                {board ? board[0].name : ""}
                            </Typography>
                        }
                        <div className={classes.heroButtonsContainer}>
                            {isEdit ? ""
                                :
                                <Grid container spacing={2} justify="center">
                                    <Grid item>
                                        <Button className={classes.heroButtons} variant="contained" color="primary" onClick={() => startEditName()}>
                                            Edit Name
                                        </Button>

                                    </Grid>
                                    <Grid item>
                                        <Button className={classes.heroButtons} variant="contained" color="primary" onClick={() => copyLink()}>
                                            Share Link
                                    </Button>
                                    </Grid>
                                </Grid>
                            }
                        </div>
                    </Container>
                    <Divider />
                    {isCopied ?
                        <Alert severity="success" onClose={() => closeCopy()}>
                            Share link copied to clipboard
                        </Alert>
                        : ""
                    }

                    <DragDropContext onDragEnd={onDragEnd}>
                        <Container className={classes.columnGrid} maxWidth="md">
                            {/* End hero unit */}
                            <Grid container justify="center" spacing={4}>
                                {board ?
                                    board[0].column.map((column) => (
                                        <Grid item key={column.ID} md={4}>
                                            <Column boardID={ID} column={column} changeColumn={(column) => changeColumn(column)}></Column>
                                        </Grid>
                                    )) : ""
                                }
                            </Grid>
                        </Container>
                    </DragDropContext>
                </div>
            </main>
        </React.Fragment >
    );
}