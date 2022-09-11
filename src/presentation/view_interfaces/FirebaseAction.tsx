// Firebase関係
import { onSnapshot } from "firebase/firestore";
import {
    doc,
    setDoc,
    collection,
    getDocs,
    query,
    where,
    updateDoc,
} from "firebase/firestore";
import { firebaseFirestore } from "../../data/Firebase";

export function AddMember(name, address, role) {
    try {
        if (name != "" && address != "") {
            const usersRef = collection(firebaseFirestore, "users");
            const newDoc = doc(usersRef).id;
            const documentRef = setDoc(doc(usersRef, newDoc), {
                name: name,
                address: address.toLowerCase(),
                role: role,
                team: "Unyte",
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