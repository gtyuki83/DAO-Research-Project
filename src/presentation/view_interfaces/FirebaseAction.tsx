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

export async function AddMember(name, address, role) {
    // アドレスが既に存在するか検索
    const usersRef = collection(firebaseFirestore, "users");
    const snapshot = await getDocs(query(usersRef, where("address", "==", address)));
    // アドレスがあればTeamに該当のものを追加、なければユーザーを追加しTeam追加
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
    // ↑ここの引数でteam名をもらうように処理変更予定
    try {
        if (name != "" && address != "") {
            const usersRef = collection(firebaseFirestore, "users");
            const newDoc = doc(usersRef).id;
            const documentRef = setDoc(doc(usersRef, newDoc), {
                name: name,
                address: address.toLowerCase(),
                role: role,
                team: ['Unyte'],
                id: newDoc,
            });
            alert("成功！");
        } else {
            alert("空の値があります🥺");
        }
    } catch (error) { }
};

export function AddProposal(title, description, priority, assign, due, createdBy) {
    try {
        if (title != "" && description != "" && priority != "" && assign != "" && due != "") {
            const proposalsRef = collection(firebaseFirestore, "proposals");
            const newDoc = doc(proposalsRef).id;
            const documentRef = setDoc(doc(proposalsRef, newDoc), {
                accepted: false,
                title: title,
                description: description,
                priority: priority,
                assign: assign,
                due: due,
                createdBy: createdBy,
                team: "Unyte",
                id: newDoc,
            });
            alert("成功！");
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

export function SubmitOutput(description, link, account, id) {
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