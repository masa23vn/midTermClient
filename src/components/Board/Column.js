import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import { Droppable } from 'react-beautiful-dnd';

import socket from "../../utils/socket.service";
import WorkCard from "./WorkCard";

const useStyles = makeStyles((theme) => ({
    column: {
        height: '100%',
        minWidth: '285px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '4px solid',
        borderColor: 'rgb(63, 81, 181)',
    },
    columnDroppable: {
        height: "100%",
        marginTop: '10px',
    },
    columnIsDragged: {
        height: "100%",
        marginTop: '10px',
        backgroundColor: "skyblue",
    },
    columnContent: {
        height: "100%",
        maxWidth: '265px',
        minWidth: '265px',
    },
}));

export default function Column(props) {
    const classes = useStyles();
    const boardID = props.boardID;
    const column = props.column;
    const data = column.card

    const [open, setOpen] = useState(false);    // open/close create dialog
    const [des, setDes] = useState("");                   // name of new board
    const [message, setMessage] = useState("");             // error mess when create
    const [status, setStatus] = useState("error");          // check if create is success

    // manage create dialog
    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setDes("");
        setOpen(false);
        setMessage("");
        setStatus("error");
    };
    const onChangeDes = (e) => {
        setDes(e.target.value);
    };
    const handleCreate = async () => {
        if (des.length > 1000) {
            setMessage("Card's content must not exceed 1000 character");
            setStatus("error");
        }
        else {
            try {
                const date = new Date();
                socket.emit("add_card"
                    , { des: des, date: date, boardID: boardID, columnID: column.ID }
                    ,
                    function (insertID) {
                        setMessage("Tạo thành công");
                        setStatus("success");
                        setDes("");

                        // add new board to front end data
                        const newData = data.slice();
                        newData.push({ ID: insertID, description: des, dateCreate: date.toJSON() });

                        const newColumn = column;
                        newColumn.card = newData;
                        props.changeColumn(newColumn);
                    });

            }
            catch (error) {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                setMessage(resMessage);
                setStatus("error");

            }
        }
    };

    // delete card
    const deleteCard = (i) => {
        const newData = data.filter((e) => { return e.ID !== i })
        const newColumn = column;
        newColumn.card = newData;
        props.changeColumn(newColumn);
    }

    // edit card
    const editCard = (i, des) => {
        const newData = data.slice();
        newData.forEach((card) => {
            if (card.ID === i) {
                card.description = des;
            }
        })
        const newColumn = column;
        newColumn.card = newData;
        props.changeColumn(newColumn);
    }

    return (
        <Card className={classes.column} >
            <CardContent className={classes.columnContent}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                    {column ? column.name : ""}
                </Typography>
                <Card variant="outlined">
                    <Button onClick={handleClickOpen} variant="contained" color="primary" component="span" fullWidth>
                        <AddIcon />
                    </Button>
                </Card>

                <Dialog open={open} maxWidth="xs" fullWidth={true} onClose={handleClose} aria-labelledby="form-dialog-title">
                    <DialogTitle id="form-dialog-title">New card</DialogTitle>
                    {message && (
                        <div className="form-group">
                            <Alert severity={status}>
                                {message}
                            </Alert>
                        </div>
                    )}

                    <DialogContent>
                        <Typography >Content: *</Typography>
                        <TextField
                            autoFocus
                            required
                            margin="dense"
                            id="content"
                            value={des}
                            type="text"
                            fullWidth
                            multiline
                            onChange={(e) => onChangeDes(e)}
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose} color="primary">
                            Cancel
                      </Button>
                        <Button onClick={handleCreate} color="primary">
                            Create
                      </Button>
                    </DialogActions>
                </Dialog>

                <Droppable droppableId={column.ID.toString()}>
                    {(provided, snapshot) => (
                        <div className={snapshot.isDraggingOver ? classes.columnIsDragged : classes.columnDroppable}
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                        >
                            {
                                data ?
                                    data.map((card, index) => (
                                        <Grid item key={card.ID}>
                                            <WorkCard card={card} index={index} boardID={boardID} columnID={column.ID} editCard={(i, des) => editCard(i, des)} deleteCard={(i) => deleteCard(i)}></WorkCard>
                                        </Grid>
                                    )) : ""
                            }
                            {provided.placeholder}
                        </div>
                    )
                    }
                </Droppable>
            </CardContent>
        </Card>
    );
}

