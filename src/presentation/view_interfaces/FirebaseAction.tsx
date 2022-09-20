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
                    console.log(parseInt(pxc / 2))
                    await updateDoc(docRef, {
                        PXC: pxc - parseInt(reward / 2)
                    });

                    // 提案の登録
                    const proposalsRef = collection(firebaseFirestore, "proposals");
                    const newDoc = doc(proposalsRef).id;
                    const documentRef = await setDoc(doc(proposalsRef, newDoc), {
                        accepted: false,
                        title: title,
                        description: description,
                        priority: priority,
                        assign: assign,
                        due: due,
                        createdBy: createdBy,
                        reward: reward,
                        team: "tgPrPgpNPVpc1pIkKgSF",
                        id: newDoc,
                    });
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
                    } catch (error) {
                        alert(`送金に失敗しました。`);
                        console.error(error);
                    }
                    alert("成功！");
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
