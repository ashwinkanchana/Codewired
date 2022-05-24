import React, { useState } from "react";
import shortid from "shortid";
import { uniqueNamesGenerator, colors } from 'unique-names-generator';
import { toast } from 'react-toastify';
import axios from '../api'
export default function Join(props) {
    const uniqueNamesGeneratorConfig = { dictionaries: [colors] }
    const [roomNameInp, setRoomNameInp] = useState(shortid.generate());
    const [displayNameInp, setDisplayNameInp] = useState(uniqueNamesGenerator(uniqueNamesGeneratorConfig));
    const [passwordInp, setPasswordInp] = useState("pass");
    const [passwordConfInp, setPasswordConfInp] = useState("pass");
    const [createRoom, setCreateRoom] = useState(false);
    const [requestPending, setRequestPending] = useState(false);

    const submit = async (event) => {
        event.preventDefault();
        if (roomNameInp.trim() === '' || displayNameInp.trim() === '' || passwordInp.trim() === '') {
            toast.error('Kindly fill in all fields');
            // alert('Please enter Room Name');
            return;
        }
        if (createRoom && passwordConfInp.trim() !== passwordInp.trim()) {
            toast.error('Passwords do not match');
            return;
        }
        setRequestPending(true);
        const data = { roomName: roomNameInp.trim(), password: passwordInp.trim(), userName: displayNameInp.trim() };
        if (createRoom) {
            try {
                const response = await axios.post(`/api/v1/workspaces/create`, data);
                sessionStorage.setItem('roomName', roomNameInp);
                sessionStorage.setItem('displayName', displayNameInp);
                if (response.data.members) {
                    sessionStorage.setItem('members', JSON.stringify(response.data.members));
                }
                setRequestPending(false);
                props.setVerified(true); // have parent (App.js) change to the next page
            } catch (error) {
                if (error) {
                    if (error.response.status === 400) {
                        toast.error("This workspace already exists\nLog in Instead", { autoClose: false });
                    } else {
                        toast.error('Something went wrong');
                    }
                } else {
                    toast.error('Something went wrong');
                }
                setRequestPending(false);
            }
        } else {
            try {
                const response = await axios.post(`/api/v1/workspaces/login`, data);
                sessionStorage.setItem('roomName', roomNameInp);
                sessionStorage.setItem('displayName', displayNameInp);
                if (response.data.members) {
                    sessionStorage.setItem('members', JSON.stringify(response.data.members));
                }
                setRequestPending(false);
                props.setVerified(true); // have parent (App.js) change to the next page
            } catch (error) {
                if (error) {
                    if (error.response.status === 404) {
                        toast.error("Workspace not found\nCreate it instead", { autoClose: false })
                    }
                    else if (error.response.status === 403) {
                        toast.error("Invalid Password");
                    } else {
                        toast.error('Something went wrong');
                    }
                } else {
                    toast.error('Something went wrong');
                }

                setRequestPending(false);
            }
        }
    }

    return (

        <div >
            <form onSubmit={e => submit(e)}>
                <span >
                    WorkSpace Details
                </span>
                <i className="fa fa-info-circle info-circle" aria-hidden="true" data-tip="Members should use the same workspace name and password in order to collaborate in the workspace" data-for="cred-tltp"></i>
                <div className="wrap-input100 validate-input m-b-16" data-validate="Please enter room name">
                    <input className="input100" type="text" name="room-name" placeholder="Workspace Name" id="room-name"
                        value={roomNameInp} onChange={(e) => { setRoomNameInp(e.currentTarget.value.trim()) }}
                    />
                    <span className="focus-input100"></span>
                </div>
                <div className="wrap-input100 validate-input m-b-16" data-validate="Please enter display name">
                    <input className="input100" type="text" name="display-name" placeholder="Your Display Name"
                        value={displayNameInp} onChange={(e) => { setDisplayNameInp(e.currentTarget.value.trim()) }}
                    />
                    <span className="focus-input100"></span>
                </div>
                <i className="fa fa-info-circle info-circle" aria-hidden="true" data-tip="The display name will identify you to others in the workspace" data-for="cred-tltp"></i>


                <div className="wrap-input100 validate-input m-b-16" data-validate="Please enter Room Password">
                    <input className="input100" type="password" name="pass" placeholder="Password"
                        value={passwordInp} onChange={(e) => setPasswordInp(e.currentTarget.value)} />
                    <span className="focus-input100"></span>
                </div>

                {createRoom && <div className="wrap-input100 validate-input m-b-16" data-validate="Please re-enter password">
                    <input className="input100" type="password" name="pass-conf" placeholder="Confirm Password"
                        value={passwordConfInp} onChange={(e) => setPasswordConfInp(e.currentTarget.value)} />
                    <span className="focus-input100"></span>
                </div>}

                {!createRoom && <div className="create-workspace">
                    <span className="txt1 p-b-9">
                        Don’t have a Workspace?
                    </span>
                    <span className="txt3 create-txt" onClick={() => setCreateRoom(true)}>Create One</span>
                </div>}

                {createRoom && <div className="create-workspace">
                    <span className="txt1 p-b-9">
                        Already have a Workspace?
                    </span>
                    <span className="txt3 create-txt" onClick={() => setCreateRoom(false)}>Login Instead</span>
                </div>}

                <div className="container-login100-form-btn">
                    {!requestPending && <button className="login100-form-btn">
                        Proceed
                    </button>}
                    {requestPending && <span className="txt3">Please wait...</span>}
                </div>
            </form>
        </div>
    );
}