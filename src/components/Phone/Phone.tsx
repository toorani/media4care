import React from 'react';
import './Phone.css';
import { PhoneState } from '../Manager/Manager';

interface Props {
    phoneNumber: string;
    phoneState: PhoneState;
    makeCall: (source: string, destination: string) => void;
    answerCall: (phoneNumber: string) => void;
    rejectCall: (phoneNumber: string) => void;
    endCall: (phoneNumber: string) => void;
}

export const Phone = (props: Props) => {
    const { phoneNumber, phoneState, makeCall, answerCall, rejectCall, endCall } = props;

    const { mode, callInfo } = phoneState;
    const [remotePhoneNo, setRemotePhoneNo] = React.useState<string>('');

    const [message, SetMessage] = React.useState<string>('');

    React.useEffect(() => {
        if (callInfo) {
            SetMessage(callInfo);
            setTimeout(() => {
                SetMessage('');
            }, 3000);
        }

    }, [callInfo])


    return (
        <div className="phone">
            <h1>
                <small>Phone Number: </small>
                {phoneNumber}
            </h1>
            <div className="status">
                Status:
                <span className="detail">
                    {mode === 'IDLE' && <>Idle</>}
                    {mode === 'INCOMING' && <>Ringing</>}
                    {mode === 'OUTGOING' && <>Remote is ringing</>}
                    {mode === 'ONGOING' && <>Talking</>}
                    {message && (<>, {message}</>)}
                </span>
            </div>


            <div>
                {mode === "IDLE" &&
                    <>
                        <input className="numberInput" type="text" value={remotePhoneNo} onChange={(e) => setRemotePhoneNo(e.target.value)} />
                        <button className='call' onClick={() => makeCall(phoneNumber, remotePhoneNo)}>Call</button>
                    </>
                }

                {mode === "INCOMING" &&
                    <>
                        <button className='answer' onClick={() => answerCall(phoneNumber)}  >Answer</button>
                        <button className='reject' onClick={() => rejectCall(phoneNumber)}>Reject</button>
                    </>
                }
                {mode === "ONGOING" &&
                    <>
                        <button className='reject' onClick={() => endCall(phoneNumber)}>End call</button>
                    </>
                }
            </div>

        </div>
    );
}