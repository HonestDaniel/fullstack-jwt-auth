import React, {useContext, useEffect, useState} from 'react';
import LoginForm from "./components/LoginForm";
import {Context} from "./index";
import {observer} from 'mobx-react-lite';
import {deflateRaw} from "zlib";
import UserService from "./services/UserService";
import {IUser} from "./models/IUser";

function App() {
    const {store} = useContext(Context)
    const [users, setUsers] = useState<IUser[]>([]);
    useEffect(() => {
        if (localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    async function getUsers() {
        try {
            const response = await UserService.fetchUsers();
            setUsers(response.data);
        } catch (e: any) {

        }
    }

    if (store.isLoading) {
        return (
            <h1>Загрузка...</h1>
        )
    }

    if (!store.isAuth) {
        return (
            <LoginForm></LoginForm>
        )
    }

  return (
    <div>
        <h1>{store.isAuth ? `Пользоваель авторизован: ${store.user.email}` : 'Пользоваель не авторизован'}</h1>
        <button onClick={() => {store.logout()}}>Выйти</button>
        <button onClick={() => {getUsers()}}>Получить пользователей</button>
        {users.map(user =>
            <div key={user.email}>{user.email}</div>
        )}
    </div>
  );
}

export default observer(App);
