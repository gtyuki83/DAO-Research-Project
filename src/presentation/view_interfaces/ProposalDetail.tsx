import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import Tooltip from '@mui/material/Tooltip';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Link } from "react-router-dom";
import Paper from '@mui/material/Paper';

import { useEffect, useState } from 'react';
import {
    useParams,
} from 'react-router-dom';
// Firebase関係
import {
    doc,
    collection,
    getDoc,
    getDocs,
    query,
} from "firebase/firestore";
import { firebaseFirestore } from "../../data/Firebase";

import { AcceptProposal, votingAction } from "./FirebaseAction.tsx";
import CheckWallet from "../../data/blockchain_actions/checkWallet";
import { OutputAlert } from "./SnackBar.tsx";

const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    color: 'white',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    background: 'linear-gradient(45deg, #ff7f50,#ff1493)',
    boxShadow: 24,
    p: 4,
};

export default function ProposalDetail() {
    const { id } = useParams();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [voting, setVoting] = React.useState({ 0x00: "for" });
    const [votingResult, setVotingResult] = React.useState(false);
    const [snack, setSnack] = React.useState('false');

    const [data, setData] = React.useState({
        assign: '',
        title: '',
        priority: '',
        description: '',
        createdBy: '',
    });

    const [currentAccount, setCurrentAccount] = useState(null);

    async function readProposal() {
        var arr = {};
        const docRef: any = doc(firebaseFirestore, "proposals", id);
        const docSnap: any = await getDoc(docRef);
        // proposalの存在を判定
        if (docSnap.exists()) {
            setData({
                title: docSnap.data().title,
                assign: docSnap.data().assign,
                priority: docSnap.data().priority,
                description: docSnap.data().description,
                createdBy: docSnap.data().createdBy,
            });
            // setVotingId();
        } else {
            console.log("No such document!");
        }
        // votingの存在を判定
        const querySnapshot = await getDocs(collection(firebaseFirestore, `proposals/${id}/voting`));
        querySnapshot.docs.map((doc, i) => {
            arr[doc.id] = doc.data().vote
        });
        setVoting(arr);
        // votingがacceptedされている場合は状態をtrueにセット
        if (docSnap.data().accepted == true) {
            setVotingResult(true);
        }
    };
    useEffect(() => {
        connect();
        readProposal();
    }, [voting]);

    const connect = async () => {
        CheckWallet().then(function (result) {
            const address = result;
            setCurrentAccount(address);
        });
    };

    return (
        <div>
            <OutputAlert snack={snack} setSnack={setSnack}></OutputAlert>
            <Box display="flex" >
                <Button variant="contained" endIcon={<ArrowBackIosNewIcon />} component={Link} to={`/proposals`} >
                    Back
                </Button>
            </Box>
            {/* <Box display="flex" justifyContent="flex-end" onClick={handleOpen}>
                <Tooltip title="Detail">
                    <Button onClick={() => {
                        handleOpen();
                        readProposal();
                    }} style={{ background: 'linear-gradient(45deg, #ff7f50,#ff1493)' }} variant="contained" endIcon={<AddCircleIcon />}>
                        Detail
                    </Button>
                </Tooltip>
            </Box> */}
            {/* テスト：カード表示 */}
            <Card >

                <CardContent>
                    {votingResult && (
                        <Button sx={{ background: 'linear-gradient(45deg, #ff7f50,#ff1493)', color: 'white', m: 1, mb: 3 }}>
                            <Typography>
                                承認済
                            </Typography>
                        </Button>
                    )
                    }
                    <Typography gutterBottom variant="h5" component="div">
                        {data.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {data.description}
                    </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center' }}>
                    <Box sx={{ justifyContent: 'center' }}>
                        proposed by:
                        <Button size="small" component={Link} to={`/profile/${data.createdBy}`}>
                            ニックネーム未設定({data.createdBy.substr(0, 5)}...{data.createdBy.substr(-5)})
                        </Button>
                    </Box>
                </CardActions>
            </Card>

            {votingResult && (
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <Button disabled variant="contained" endIcon={<AddCircleIcon />} sx={{ width: 120, m: 2 }} >
                        For
                    </Button>
                    <Button disabled variant="contained" endIcon={<RemoveCircleIcon />} sx={{ width: 120, m: 2 }} >
                        Against
                    </Button>
                </Typography>
            )
            }
            {votingResult == false && (
                <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                    <Button variant="contained" endIcon={<AddCircleIcon />} sx={{ width: 120, m: 2 }} onClick={async () => {
                        const trying = await votingAction(id, currentAccount, "for");
                        if (trying == "success") {
                            setSnack("vote")
                        }
                        await readProposal();
                    }} >
                        For
                    </Button>

                    <Button variant="contained" endIcon={<RemoveCircleIcon />} sx={{ width: 120, m: 2 }} onClick={async () => {
                        const trying = await votingAction(id, currentAccount, "against");
                        if (trying == "success") {
                            setSnack("vote")
                        }
                        await readProposal();
                    }}>
                        Against
                    </Button>
                </Typography>
            )
            }
            <Box sx={{ justifyContent: 'center' }}>
                <Paper sx={{ width: '100%', overflow: 'hidden', justifyContent: 'center' }}>
                    <Typography
                        variant="h4"
                        id="tableTitle"
                        component="div"
                    >
                        Voting
                    </Typography>
                    <TableContainer >
                        <Table sx={{ justifyContent: 'center' }} aria-label="simple table">
                            <TableBody>
                                {Object.keys(voting).map((doc, i) => {
                                    return (<TableRow
                                        key={doc}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell align='center' component="th" scope="row" sx={{ width: 120, m: 2 }}>
                                            {doc.substr(0, 5)}...{doc.substr(-5)}
                                        </TableCell>
                                        <TableCell align='center' component="th" scope="row" sx={{ width: 120, m: 2 }}>
                                            {voting[doc]}
                                        </TableCell>

                                    </TableRow>)
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            </Box>
            {/* カード表示終わり */}

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                {/* <Box sx={style} component={Link} to="/tasks"> */}
                {/* これでリンクを作れるよ！ */}
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        New Proposal
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {data.title}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {data.description}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {data.assign}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {data.createdBy}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        {data.priority}
                    </Typography>

                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Button variant="contained" endIcon={<AddCircleIcon />}>
                            For
                        </Button>

                        <Button variant="contained" endIcon={<AddCircleIcon />}>
                            Against
                        </Button>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <Button variant="contained" endIcon={<AddCircleIcon />} onClick={() => { AcceptProposal(id) }}>
                            Accept
                        </Button>
                    </Typography>
                </Box>
            </Modal>
        </div >
    );
}
