import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from '../firebaseConfig'
import { doc, getDoc, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined)

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            // console.log("usuário: ", user)
            if (user) {
                setIsAuthenticated(true)
                setUser(user)
                updateUserData(user.uid)
            } else {
                setIsAuthenticated(false)
                setUser(null)
            }
        })
        return unsub
    }, [])

    const updateUserData = async (userId) => {
        let docRef = doc(db, "users", userId);
        let docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            let data = docSnap.data();
            setUser({
                ...user,
                email: auth.currentUser.email,
                username: data.username,
                profilePicture: data.profilePicture,
                userId: data.userId,
                telefone: data.telefone,
                role: 'user'
            });
        } else {
            docRef = doc(db, "professionals", userId);
            docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                let data = docSnap.data();
                setUser({
                    ...user,
                    email: auth.currentUser.email,
                    username: data.username,
                    profilePicture: data.profilePicture,
                    userId: data.userId,
                    especialidade: data.especialidade,
                    experiencia: data.experiencia,
                    sexo: data.sexo,
                    telefone: data.telefone,
                    instagram: data.instagram,
                    localizacao: data.localizacao,
                    dataNascimento: data.dataNascimento,
                    role: 'profissional' // Definindo como profissional se encontrado na coleção 'professionals'
                });
            } else {
                docRef = doc(db, "anunciantes", userId);
                docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    let data = docSnap.data();
                    setUser({
                        ...user,
                        email: auth.currentUser.email,
                        nomeFantasia: data.nomeFantasia,
                        profilePicture: data.profilePicture,
                        userId: data.userId,
                        role: 'anunciante',
                    });
                } /*else {
                    console.error("Usuário não encontrado nas coleções 'users', 'professionals' ou 'anunciantes'.");
                }*/
            }
        }
    };

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            console.log('Usuário logado: ', response?.user);
            return { success: true };
        } catch (e) {
            let msg = e.message;

            // Mensagens de erro customizadas
            if (msg.includes('auth/invalid-email')) msg = "E-mail inválido";
            if (msg.includes('auth/invalid-credential')) msg = "Credenciais inválidas";

            console.error("Erro ao logar usuário: ", msg); // Adiciona logs de erro

            return { success: false, msg };
        }
    }

    const logout = async () => {
        try {
            await signOut(auth);
            return { success: true };
        } catch (e) {
            return { success: false, msg: e.message, error: e };
        }
    }

    const register = async (email, password, username, profilePicture, telefone) => {
        try {
            // Cria o usuário com e-mail e senha
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Usuário criado: ', response?.user);

            // Configura o documento no Firestore
            await setDoc(doc(db, "users", response?.user?.uid), {
                username,
                profilePicture: profilePicture || null,
                userId: response?.user?.uid,
                email,
                telefone
            });

            return { success: true, data: response?.user };
        } catch (e) {
            let msg = e.message;

            // Mensagens de erro customizadas
            if (msg.includes('auth/invalid-email')) msg = "E-mail inválido";

            console.error("Erro ao registrar usuário: ", msg); // Adiciona logs de erro

            return { success: false, msg };
        }
    }

    const registerProfessional = async (email, password, username, profilePicture, selectedEspecialidade, sexo, telefone, instagram, experiencia, localizacao, dataNascimento) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Usuário criado: ', response?.user);


            const sdataNascimento = new Date(
                dataNascimento.getFullYear(),
                dataNascimento.getMonth(),
                dataNascimento.getDate()
            );


            await setDoc(doc(db, "professionals", response?.user?.uid), {
                username,
                profilePicture: profilePicture || null,
                userId: response?.user?.uid,
                especialidade: selectedEspecialidade,
                experiencia,
                sexo,
                telefone,
                instagram,
                email,
                localizacao,
                dataNascimento: sdataNascimento
            });
            return { success: true, data: response?.user };
        } catch (e) {
            let msg = e.message;

            if (msg.includes('auth/invalid-email')) msg = "E-mail inválido";
            if (msg.includes('auth/email-already-in-use')) msg = "E-mail já está em uso";

            console.error("Erro ao registrar profissional: ", msg);

            return { success: false, msg };
        }
    }

    const registerAnunciante = async (email, password, nomeFantasia, profilePicture) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            console.log('Usuário criado: ', response?.user); 

            await setDoc(doc(db, "anunciantes", response?.user?.uid), {
                nomeFantasia,
                email, 
                profilePicture: profilePicture || null,
                userId: response?.user?.uid,
            });

            return { success: true, data: response?.user };
        } catch (e) {
            let msg = e.message;

            if (msg.includes('auth/invalid-email')) msg = "E-mail inválido";

            console.error("Erro ao registrar anunciante: ", msg);

            return { success: false, msg };
        }
    }

    const updateAnuncianteData = async (userId, newData) => {
        try {
            const anuncianteRef = doc(db, "anunciantes", userId);
            await updateDoc(anuncianteRef, newData);
            updateUserData(userId); // Atualiza o estado do usuário com os novos dados
            return { success: true };
        } catch (e) {
            console.error("Erro ao atualizar anunciante: ", e.message);
            return { success: false, msg: e.message };
        }
    };

    const resetPassword = async (email) => {
        try {
            await sendPasswordResetEmail(auth, email);
            return { success: true, msg: "E-mail de redefinição de senha enviado com sucesso!" };
        } catch (e) {
            let msg = e.message;

            // Customizando mensagens de erro
            if (msg.includes('auth/user-not-found')) msg = "Usuário não encontrado";
            if (msg.includes('auth/invalid-email')) msg = "E-mail inválido";

            console.error("Erro ao enviar e-mail de redefinição: ", msg);

            return { success: false, msg };
        }
    }


    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, register, registerProfessional, registerAnunciante, updateAnuncianteData, updateUserData, resetPassword }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error('useAuth deve estar dentro do AuthContextProvider');
    }
    return value;
}