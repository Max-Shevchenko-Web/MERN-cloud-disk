import React, {useState} from 'react';
import './authorization.scss'
import Input from "../../utils/input/Input";
import {useDispatch} from "react-redux";
import {login} from "../../actions/user";

const Login = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()

    const loginHendler = () => {
      dispatch(login(email, password))
    }

    const keyEnter = e => {
      if (e.key === 'Enter') {
        dispatch(login(email, password))
      }
    }

    return (
        <div className='authorization' onKeyPress={keyEnter}>
            <div className="authorization__header">Авторизация</div>
            <Input value={email} setValue={setEmail} type="text" placeholder="Введите email..."/>
            <Input value={password} setValue={setPassword} type="password" placeholder="Введите пароль..."/>
            <button className="authorization__btn" onClick={loginHendler}>Войти</button>
        </div>
    );
};

export default Login;