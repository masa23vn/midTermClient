import React, { useState, useEffect } from 'react';
import {
    useParams,
    useHistory,
} from "react-router-dom";
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Alert from '@material-ui/lab/Alert';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Divider from '@material-ui/core/Divider';
import Moment from 'react-moment';

import DataService from "../utils/data.service";


const useStyles = makeStyles((theme) => ({
    content: {
        flexGrow: 1,
        height: '100vh',
        overflow: 'auto',
        marginTop: '20px',
    },
    icon: {
        marginRight: theme.spacing(2),
    },
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
    },
    heroTitle: {
        display: "flex",
        flexDirection: 'column',
        alignItems: "center",
        justifyContent: "center",
    },
    heroButtons: {
        marginBottom: theme.spacing(4),
    },

    editAction: {
        marginBottom: '-25px'
    },

    columnGrid: {
        paddingTop: theme.spacing(8),
        paddingBottom: theme.spacing(8),
    },
    column: {
        height: '100%',
        minWidth: '280px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '4px solid',
        borderColor: 'rgb(63, 81, 181)',
    },
    columnDivider: {
        backgroundColor: 'rgb(63, 81, 181)',
    },
    columnContent: {
        maxWidth: '265px',
        minWidth: '265px',
    },
    card: {
        height: 'auto',
        maxWidth: '230px',
        minWidth: '230px',
        margin: '10px 0px 10px 0px',
        wordWrap: 'break-word',
        borderY: '2px solid blue',
        borderColor: 'rgb(63, 81, 181)',
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
    footer: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(6),
    },
    popover: {
        pointerEvents: 'none',
    },
    paper: {
        padding: theme.spacing(1),
    },
}));

export default function Board() {
    const classes = useStyles();
    const history = useHistory();
    const ID = useParams().id;
    const [board, setBoard] = useState();   // data board
    const [editedName, setEditedName] = useState();   // new name for board
    const [isEdit, setIsEdit] = useState(false);

    // get board from database
    function getData(ID) {
        DataService.getBoardByID(ID)
            .then(res => {
                setBoard(res.data);
            })
            .catch(err => {
                history.push("/404");
            });
    }
    useEffect(() => {
        getData(ID);
    }, [])


    // edit name
    const onChangeName = (e) => {
        setEditedName(e.target.value);
    }

    const startEditName = () => {
        setEditedName(board[0].name);
        setIsEdit(true);
    }

    const finishEditName = () => {
        if (editedName === "") {
            setEditedName(board[0].name);
            setIsEdit(false);
        }
        else {
            DataService.changeNameBoard(ID, editedName)
            board[0].name = editedName;
            setBoard(board);
            setIsEdit(false);
        }
    }

    const closeEditName = () => {
        setEditedName(board[0].name);
        setIsEdit(false);
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
                                    <DoneIcon/>
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
                        <div className={classes.heroButtons}>
                            <Grid container spacing={2} justify="center">
                                <Grid item>
                                    {isEdit ? ""
                                        :
                                        <Button variant="contained" color="primary" onClick={() => startEditName()}>
                                            Edit board's name
                                        </Button>
                                    }
                                </Grid>
                            </Grid>
                        </div>
                    </Container>
                    <Divider />
                    <Container className={classes.columnGrid} maxWidth="md">
                        {/* End hero unit */}
                        <Grid container spacing={4}>
                            {board ?
                                board[0].column.map((column) => (
                                    <Grid item key={column.ID} xs={12} sm={6} md={4}>
                                        <Column boardID={ID} column={column}></Column>
                                    </Grid>
                                )) : ""
                            }
                        </Grid>
                    </Container>
                </div>
            </main>
        </React.Fragment>
    );
}

function Column(props) {
    const classes = useStyles();
    const boardID = props.boardID;
    const column = props.column;
    const [data, setData] = useState([]);

    const [open, setOpen] = useState(false);    // open/close create dialog
    const [des, setDes] = useState("");                   // name of new board
    const [message, setMessage] = useState("");             // error mess when create
    const [status, setStatus] = useState("error");          // check if create is success

    // get all card of column from database
    const getAllCard = () => {
        DataService.getAllCardByColumn(boardID, column.ID)
            .then(res => setData(res.data))
            .catch(err => err);
    }

    useEffect(() => {
        getAllCard();
    }, [])

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
    const handleCreate = () => {
        if (des.length > 1000) {
            setMessage("Card's content must not exceed 1000 character");
            setStatus("error");
        }
        else {
            DataService.createCard(boardID, column.ID, des).then(
                (res) => {
                    setMessage("Tạo thành công");
                    setStatus("success");
                    setDes("");
                    getAllCard();
                },
                (error) => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setMessage(resMessage);
                    setStatus("error");
                });
        }
    };



    return (
        <Card className={classes.column} >
            <CardContent className={classes.columnContent}>
                <Typography gutterBottom variant="h5" component="h2" align="center">
                    {column ? column.name : ""}
                </Typography>
                {/*<Divider variant="fullWidth" className={classes.columnDivider} />*/}
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


                {/* End hero unit */}
                {data ?
                    data.map((card) => (
                        <Grid item key={card.ID} >
                            <WorkCard card={card} boardID={boardID} columnID={column.ID} getAllCard={() => getAllCard()}></WorkCard>
                        </Grid>
                    )) : ""
                }

            </CardContent>
        </Card>
    );
}

function WorkCard(props) {
    const classes = useStyles();
    const [card, setCard] = useState(props.card);
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
    const handleDelete = () => {
        DataService.deleteCard(props.boardID, props.columnID, card.ID)
            .then(res => {
                setOpenDelete(false);
                props.getAllCard();
            })
            .catch(err => err);;
    };

    //edit card
    const onChangeContent = (e) => {
        setEditedContent(e.target.value);
    }
    const startEditContent = () => {
        setEditedContent(card.description);
        setIsEdit(true);
    }

    const finishEditContent = () => {
        DataService.changeContentCard(props.boardID, props.columnID, card.ID, editedContent)
        .then((res) => {
            setCard(res.data);    
        })
        setIsEdit(false);
    }

    const closeEditContent = () => {
        setEditedContent(card.name);
        setIsEdit(false);
    }

    return (
        <Card className={classes.card} variant="outlined">
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
                <Box className={classes.dateEdit}>
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
    );
}