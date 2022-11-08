// Firebase関係
import { onSnapshot } from "firebase/firestore";
import {
    doc,
    setDoc,
    collection,
    getDoc,
    getDocs,
    query,
    where,
    updateDoc,
    arrayUnion,
} from "firebase/firestore";
import { firebaseFirestore } from "../../data/Firebase";

// スマコン関連のインポート
import { ethers } from "ethers"
import MyTokenContract from '../../contracts/MyToken.json';
import { create } from "@mui/material/styles/createTransitions";

export async function AddMember(name, address, role, teamId) {
    console.log(name, address, role, teamId)
    // ↑ここの引数でteam名をもらうように処理変更予定
    try {
        if (name != "" && address != "") {
            // アドレスが既に存在するか検索
            const docRef = doc(firebaseFirestore, "users", address.toLowerCase());
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                // 参加済チームに今回のチームidを追加
                const docSna = await updateDoc(docRef, {
                    name: name,
                    role: role,
                    team: arrayUnion(teamId),
                    // team: [teamId],
                });
            } else {
                const usersRef = collection(firebaseFirestore, "users");
                const documentRef = setDoc(doc(usersRef, address.toLowerCase()), {
                    name: name,
                    address: address.toLowerCase(),
                    role: role,
                    team: [teamId],
                    id: address.toLowerCase(),
                });
            }
            alert("成功！");
        } else {
            alert("空の値があります🥺");
        }
    } catch (error) {
        console.log(error)
    }
};

export async function AddProposal(title, description, priority, rewa, assign, due, createdBy) {
    try {
        if (title != "" && description != "" && priority != "" && assign != "" && due != "") {
            const reward = parseInt(rewa)
            if (Number.isInteger(reward)) {
                // ユーザーの所持トークンを検証、所持数以上の報酬額を設定していた場合はエラー
                const docRef = doc(firebaseFirestore, "users", createdBy.toLowerCase());
                const docSnap = await getDoc(docRef);
                console.log(docSnap.data().PXC)
                const pxc = docSnap.data().PXC
                if (docSnap.data().PXC < reward) {
                    alert("所持トークンが足りません🥺")
                } else {
                    try {
                        // 報酬額を自分のウォレットから払い出す
                        const { ethereum } = window;
                        const provider = new ethers.providers.Web3Provider(ethereum);
                        const signer = provider.getSigner();
                        const tokenContract = new ethers.Contract(
                            "0x48B01f58fc52c2C9050f15F02e19a6eB2336d9C5",
                            MyTokenContract.abi,
                            signer
                        );
                        console.log(reward)
                        // pause関数の呼び出し。
                        await tokenContract.transfer("0x80a6a28291DD9226f36fa27Ee9C750119087E08a", reward);
                        await tokenContract.mint(createdBy, parseInt(reward / 2));

                        console.log(parseInt(pxc / 2))
                        await updateDoc(docRef, {
                            PXC: pxc - parseInt(reward / 2)
                        });

                        // 提案の登録
                        const proposalsRef = collection(firebaseFirestore, "proposals");
                        const newDoc = doc(proposalsRef).id;
                        const documentRef = await setDoc(doc(proposalsRef, newDoc), {
                            accepted: true,
                            title: title,
                            description: description,
                            priority: priority,
                            assign: assign,
                            due: due,
                            createdBy: createdBy,
                            reward: reward,
                            team: "tgPrPgpNPVpc1pIkKgSF",
                            id: newDoc,
                            // ボーナス送付有無
                            rewarded: false,
                            // タスク完了有無
                            done: false,
                        });
                    } catch (error) {
                        alert(`送金に失敗しました。`);
                        console.error(error);
                    }
                    // alert("成功！");
                }
            } else {
                alert("報酬額は整数で入力してください🥺");
            }
        } else {
            alert("空の値があります🥺");
        }
    } catch (error) { }
};

export async function AcceptProposal(id) {
    console.log(id)
    await updateDoc(doc(firebaseFirestore, "proposals", id.id), {
        accepted: true
    });
}

export function SubmitOutput(description, link, account, id, team) {
    try {
        if (description != "" && link != "" && id != "" && account != "") {
            const outputsRef = collection(firebaseFirestore, "outputs");
            const newDoc = doc(outputsRef).id;
            const documentRef = setDoc(doc(outputsRef, newDoc), {
                account: account,
                link: link,
                description: description,
                taskid: id,
                outputid: newDoc,
                team: team,
            });
            alert("成功！");
        } else {
            alert("空の値があります🥺");
        }
    } catch (error) { }
};

export async function AddTeam(name, description, address) {
    try {
        if (name != "" && address != "") {
            // チームを追加
            const teamsRef = collection(firebaseFirestore, "teams");
            const newDoc = doc(teamsRef).id;
            const documentRef = await setDoc(doc(teamsRef, newDoc), {
                name: name,
                description: description,
                owneraddress: address,
                id: newDoc,
            });
            // オーナーの参加チーム一覧に今回のチームを追加(id単位)
            const usersRef = collection(firebaseFirestore, "users");
            // owneraddressとアドレスが一致するuserアカウントを取得
            // await getDocs(query(usersRef, where("address", "==", address))).then(snapshot => {
            const snapshot = await getDocs(query(usersRef, where("address", "==", address)));
            console.log(snapshot)
            snapshot.forEach(async (document) => {
                console.log(`${document.id}: ${document.data().name} `);
                console.log(document.data());
                const docSnap = doc(firebaseFirestore, "users", "yE31Lilx1dPBXPLZKCMo");
                console.log(docSnap);
                // 参加済チームに今回のチームidを追加
                const docSna = await updateDoc(docSnap, {
                    team: arrayUnion(newDoc)
                });
                console.log(newDoc);
            });
            // })
            alert("成功！");
        } else {
            alert("チーム名を入力してください🥺");
        }
    } catch (error) { }
};

export function SubmitComment(teamid, from, to, comment) {
    try {
        if (teamid != "" && from != "" && to != "" && comment != "") {
            const commentsRef = collection(firebaseFirestore, "comments");
            const newDoc = doc(commentsRef).id;
            const documentRef = setDoc(doc(commentsRef, newDoc), {
                teamid: teamid,
                from: from,
                comment: comment,
                to: to,
                id: newDoc,
            });
            alert("成功！");
        } else {
            alert("空の値があります🥺");
        }
    } catch (error) { }
};

export async function votingAction(proposalid, userid, vote) {
    const docRef = doc(firebaseFirestore, `proposals/${proposalid}/voting`, userid.toLowerCase());
    const docSnap = await getDoc(docRef);
    const votingsRef = collection(firebaseFirestore, `proposals/${proposalid}/voting`);
    if (docSnap.exists()) {
        await updateDoc(docRef, {
            vote: vote
        });
        // alert(`${vote}に投票内容を更新しました！`)
    } else {
        await setDoc(doc(votingsRef, userid.toLowerCase()), {
            id: userid.toLowerCase(),
            vote: vote
        });
        // alert(`${userid}：${vote}で投票しました！`)
    }
    // 提案が未承認の場合、チームメンバー数の2/3にfor数が達しているかを確認、達していた場合には承認済に変更し通知
    const proposalRef = await getDoc(doc(firebaseFirestore, `proposals/${proposalid}`));
    console.log(proposalRef.data())
    // チームID取得
    const teamid = proposalRef.data().team
    // ユーザーデータを参照、teamidに該当するチームに所属している人数を確認
    const usersRef = collection(firebaseFirestore, "users");
    const snapshot = await getDocs(usersRef);
    var memberamount = 0;
    snapshot.forEach(async (document) => {
        if (document.data().team.includes(teamid)) {
            memberamount += 1;
        } else {
        }
    });
    // forの意思表示をしている人数をカウント
    const snapshot2 = await getDocs(votingsRef);
    var foramount = 0;
    snapshot2.forEach(async (document) => {
        if (document.data().vote == "for") {
            foramount += 1;
        } else {
        }
    });
    // チームメンバー数の2/3にfor数が達しているかを確認、達していた場合には承認済に変更し通知
    console.log(foramount, memberamount)
    const border = memberamount * 1 / 2;
    // if (foramount > border) {
    if (foramount > 0) {
        console.log("過半数に達したので提案は承認されました", border)
        await updateDoc(doc(firebaseFirestore, `proposals/${proposalid}`), {
            accepted: true,
            success: true
        });
        alert("タスク成功！")
        return ("success")
    } else {
        console.log("まだ過半数ではない")
        return ("success")
    }
}

// こちらはタスク完了側の処理です
export async function doneTask(proposalid) {
    console.log(proposalid)
    // 報酬を送付するアクションを実施
    console.log("報酬送付にトライ！")
    // 報酬額を取得
    const proposalRef = await getDoc(doc(firebaseFirestore, `proposals/${proposalid}`));
    const reward = proposalRef.data().reward
    console.log(reward)
    // タスクのアウトプットを出しているメンバーを確認
    const outputsRef = collection(firebaseFirestore, "outputs");
    const snapshot = await getDocs(query(outputsRef, where("taskid", "==", proposalid)));
    var arr = [];
    var memberCount = 0;
    snapshot.forEach(async (document) => {
        arr.push(document.data().account)
        memberCount += 1
        console.log(arr, memberCount);
    });
    console.log(arr, memberCount);

    // 発案者に報酬を送付
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
        "0x48B01f58fc52c2C9050f15F02e19a6eB2336d9C5",
        MyTokenContract.abi,
        signer
    );
    // 貢献者に報酬を送付
    arr.forEach(async (ar) => {
        console.log(ar)
        await tokenContract.transfer(ar, parseInt(reward / memberCount));
    })
    // 成功したら貢献者のDBをインクリメント。発案者のアドレスを格納
    arr.forEach(async (ar) => {
        console.log(ar)
        const docRef2 = doc(firebaseFirestore, "users", ar);
        const docSnap2 = await getDoc(docRef2);
        var proposalPXC_forcontributor = 0;
        const rewa = parseInt(Number(reward) / memberCount)
        if (docSnap2.exists()) {
            proposalPXC_forcontributor = docSnap2.data().PXC + rewa
            console.log(proposalPXC_forcontributor)
        }
        console.log(proposalPXC_forcontributor)
        // 発案者のPXCを更新
        await updateDoc(docRef2, {
            PXC: proposalPXC_forcontributor,
            taskPXC: rewa
        });
    })
    // 成功した場合、該当する提案のrewardedをtrueに変更
    await updateDoc(doc(firebaseFirestore, `proposals/${proposalid}`), {
        done: true
    });
    console.log("報酬送付成功！")
}

// こちらはボーナス側の処理です
export async function sendReward(proposalid) {
    console.log(proposalid)
    // 報酬を送付するアクションを実施
    console.log("報酬送付にトライ！")
    // 報酬額を取得
    const proposalRef = await getDoc(doc(firebaseFirestore, `proposals/${proposalid}`));
    const reward = proposalRef.data().reward
    console.log(reward)
    // タスクのアウトプットを出しているメンバーを確認
    const outputsRef = collection(firebaseFirestore, "outputs");
    const snapshot = await getDocs(query(outputsRef, where("taskid", "==", proposalid)));
    var arr = [];
    var memberCount = 0;
    snapshot.forEach(async (document) => {
        arr.push(document.data().account)
        memberCount += 1
        console.log(arr, memberCount);
    });
    console.log(arr, memberCount);

    // 発案者に報酬を送付
    const { ethereum } = window;
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const tokenContract = new ethers.Contract(
        "0x48B01f58fc52c2C9050f15F02e19a6eB2336d9C5",
        MyTokenContract.abi,
        signer
    );
    // transfer関数の呼び出し。
    await tokenContract.mint(proposaladdress, reward);
    // 成功したら提案者のDBをインクリメント。発案者のアドレスを格納
    const proposaladdress = proposalRef.data().createdBy
    // アドレスが既に存在するか検索
    const docRef = doc(firebaseFirestore, "users", proposaladdress);
    const docSnap = await getDoc(docRef);
    var proposalPXC = 0;
    if (docSnap.exists()) {
        proposalPXC = docSnap.data().PXC + reward
        console.log(proposalPXC)
    }
    console.log(proposalPXC)
    // 発案者のPXCを更新
    await updateDoc(docRef, {
        PXC: proposalPXC
    });
    // 貢献者に報酬を送付
    arr.forEach(async (ar) => {
        console.log(ar)
        console.log(proposaladdress)
        await tokenContract.transfer(ar, parseInt(reward / memberCount));
    })
    // 成功したら貢献者のDBをインクリメント。発案者のアドレスを格納
    arr.forEach(async (ar) => {
        console.log(ar)
        console.log(proposaladdress)
        const docRef2 = doc(firebaseFirestore, "users", ar);
        const docSnap2 = await getDoc(docRef2);
        var proposalPXC_forcontributor = 0;
        if (docSnap2.exists()) {
            proposalPXC_forcontributor = docSnap2.data().PXC + parseInt(Number(reward) / memberCount)
            console.log(proposalPXC_forcontributor)
        }
        console.log(proposalPXC_forcontributor)
        // 発案者のPXCを更新
        await updateDoc(docRef2, {
            PXC: proposalPXC_forcontributor
        });
    })
    // 成功した場合、該当する提案のrewardedをtrueに変更
    await updateDoc(doc(firebaseFirestore, `proposals/${proposalid}`), {
        rewarded: true
    });
    console.log("報酬送付成功！")
}

export async function countActivity(address) {
    console.log(address)
    // 提案、アウトプット提出、コメントのうち、該当アドレスから発出されたものをカウント
    // 提案
    const arr = [];
    const proposalsRef = collection(firebaseFirestore, "proposals");
    const snapshot = await getDocs(query(proposalsRef, where("createdBy", "==", address.toLowerCase())));

    arr.push(snapshot.size)
    const outputsRef = collection(firebaseFirestore, "outputs");
    const snapshot1 = await getDocs(query(outputsRef, where("account", "==", address.toLowerCase())));

    arr.push(snapshot1.size)
    const commentsRef = collection(firebaseFirestore, "comments");
    const snapshot2 = await getDocs(query(commentsRef, where("from", "==", address.toLowerCase())));

    arr.push(snapshot2.size)

    return (arr);
}

export async function countProposal(address) {
    // アドレスが所属するチームを特定、IDを配列に保存
    var teams = [];
    var ongoing = 0;
    var past = 0;
    const docRef = doc(firebaseFirestore, "users", address.toLowerCase());
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        // 参加済チームに今回のチームidを追加
        teams = docSnap.data().team;
        // 所属チームIDが含まれるProposalの数をカウント
        const proposalsRef = collection(firebaseFirestore, "proposals");
        const snapshot = await getDocs(proposalsRef);
        snapshot.forEach(async (document) => {
            if (teams.includes(document.data().team) && document.data().accepted == true) {
                past += 1;
            } else if (teams.includes(document.data().team) && document.data().accepted == false) {
                ongoing += 1;
            }
            else {
            }
        });
        return ([ongoing, past])
    } else {
        return ([0, 0])
    }
}
