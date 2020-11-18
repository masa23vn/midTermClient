import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Moment from 'react-moment';
import { Draggable } from 'react-beautiful-dnd';

import socket from "../../utils/socket.service";

const useStyles = makeStyles((theme) => ({
    card: {
        height: 'auto',
        maxWidth: '100%',
        minWidth: '230px',
        margin: '0px 0px 10px 0px',
        wordWrap: 'break-word',
        borderY: '2px solid blue',
        borderColor: 'rgb(63, 81, 181)',
    },
    cardIsDragged: {
        backgroundColor: 'lightgreen',
    },
    cardContent: {
        whiteSpace: 'pre-line',
    },
    cardAction: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: '-5px',
        marginBottom: '-5px'
    },
}));

export default function WorkCard(props) {
    const classes = useStyles();
    const card = props.card

    const [openDelete, setOpenDelete] = useState(false);    // open/close delete dialog
    const [editedContent, setEditedContent] = useState();   // new content for card
    const [isEdit, setIsEdit] = useState(false);

    // delete card
    const handleClickOpenDelete = () => {
        setOpenDelete(true);
    };
    const handleCloseDelete = () => {
        setOpenDelete(false);
    };
    const handleDelete = async () => {
        try {
            socket.emit("delete_card", { boardID: props.boardID, columnID: props.columnID, cardID: card.ID });
            setOpenDelete(false);
            props.deleteCard(card.ID);
        }
        catch (error) {

        }
    };

    //edit card
    const onChangeContent = (e) => {
        setEditedContent(e.target.value);
    }
    const startEditContent = () => {
        setEditedContent(card.description);
        setIsEdit(true);
    }

    const finishEditContent = async () => {
        try {
            socket.emit("edit_card", { boardID: props.boardID, columnID: props.columnID, cardID: card.ID, des: editedContent });
            props.editCard(card.ID, editedContent);
        }
        catch (error) {

        }
        setIsEdit(false);
    }

    const closeEditContent = () => {
        setEditedContent(card.description);
        setIsEdit(false);
    }

    return (
        <Draggable draggableId={card.ID.toString()} index={props.index}>
            {(provided, snapshot) => (
                <div>
                    <Card className={snapshot.isDragging ? [classes.card, classes.cardIsDragged].join(" ") : classes.card} variant="outlined"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <CardContent className={classes.cardContent}>
                            {isEdit ?
                                <Box>
                                    <TextField
                                        autoFocus
                                        required
                                        margin="dense"
                                        id="content"
                                        value={editedContent}
                                        type="text"
                                        multiline
                                        onChange={(value) => onChangeContent(value)}
                                    />
                                </Box>
                                :
                                <Typography gutterBottom variant="body1" component="p">
                                    {card ? card.description : ""}
                                </Typography>
                            }
                        </CardContent>

                        <Divider />
                        <CardActions className={classes.cardAction} disableSpacing border={1}>
                            <Box>
                                <Typography gutterBottom variant="caption" >
                                    Last edit:
                        <Moment format=" YYYY/MM/DD">
                                        {card ? card.dateCreate : ""}
                                    </Moment>

                                </Typography>
                            </Box>
                            <Box>
                                {isEdit ?
                                    <Box>
                                        <IconButton onClick={finishEditContent} color="primary" aria-label="edit" component="span" size="small">
                                            <DoneIcon />
                                        </IconButton>
                                        <IconButton onClick={closeEditContent} color="primary" aria-label="delete" component="span" size="small" >
                                            <CloseIcon />
                                        </IconButton>
                                    </Box>
                                    :
                                    <Box>
                                        <IconButton color="primary" aria-label="edit" component="span" size="small" onClick={startEditContent}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton color="primary" aria-label="delete" component="span" size="small" onClick={handleClickOpenDelete}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Box>
                                }
                                <Dialog open={openDelete} maxWidth="xs" fullWidth={true} onClose={handleCloseDelete} aria-labelledby="form-dialog-title">
                                    <DialogTitle id="form-dialog-title">Are you sure ?</DialogTitle>
                                    <DialogContent>
                                        <Typography >Do you want to delete this card</Typography>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={handleCloseDelete} color="primary">
                                            Cancel
                      </Button>
                                        <Button onClick={handleDelete} color="primary" autoFocus >
                                            Delete
                      </Button>
                                    </DialogActions>
                                </Dialog>

                            </Box>
                        </CardActions>
                    </Card>
                </div>
            )}
        </Draggable>
    );
}