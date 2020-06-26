import React from 'react';
import { Phone } from '../Phone/Phone';

export interface PhoneState {
    mode: 'IDLE' | 'INCOMING' | 'OUTGOING' | 'ONGOING';
    inComingPhoneNumber: string;
    callInfo?: string;
}

interface PhoneHandler {
    [phoneNumber: string]: PhoneState;
}

export const Manager = () => {

    const [phoneList, setPhoneList] = React.useState<PhoneHandler>({});

    const generateRandomPhone = () => {
        let phone = '';
        for (let i = 0; i < 3; i++) {
            phone += Math.floor(Math.random() * 10).toString();
        }
        return phone;
    }

    React.useEffect(() => {
        for (let i = 0; i < 4; i++) {

            let newPhone = generateRandomPhone();

            while (phoneList[newPhone]) {
                newPhone = generateRandomPhone();
            }

            setPhoneList(prev => ({
                ...prev,
                [newPhone]: { mode: "IDLE", inComingPhoneNumber: '' }
            }));
        }
    }, []);

    const makeCall = (sourceNumber: string, remoteNumber: string) => {
        const sourceState = phoneList[sourceNumber];
        const remoteState = phoneList[remoteNumber];
        
        if (!remoteState) {
            setPhoneList(prev => (
                {
                    ...prev,
                    [sourceNumber]: { ...sourceState, callInfo: "Remote unknown" },
                })
            );
            return;
        }

        if (remoteState.mode !== 'IDLE' || sourceNumber === remoteNumber) {
            setPhoneList(prev => (
                {
                    ...prev,
                    [sourceNumber]: { ...sourceState, callInfo: "Remote busy" },
                })
            );
            return;
        }

        setPhoneList(prev => (
            {
                ...prev,
                [sourceNumber]: { ...sourceState, mode: "OUTGOING", inComingPhoneNumber: remoteNumber, callInfo: "Placing Call" },
                [remoteNumber]: { ...remoteState, mode: "INCOMING", inComingPhoneNumber: sourceNumber }
            })
        );

    }

    const answerCall = (phoneNumber: string) => {
        const answeringPhone = phoneList[phoneNumber];
        const callingPhone = phoneList[answeringPhone.inComingPhoneNumber];
        setPhoneList(prev => (
            {
                ...prev,
                [phoneNumber]: { ...answeringPhone, mode: "ONGOING" },
                [answeringPhone.inComingPhoneNumber]: { ...callingPhone, mode: "ONGOING" }
            })
        );
    }

    const rejectCall = (phoneNumber: string) => {
        const rejectingPhone = phoneList[phoneNumber];
        const rejectedPhone = phoneList[rejectingPhone.inComingPhoneNumber];
        setPhoneList(prev => (
            {
                ...prev,
                [phoneNumber]: { ...rejectingPhone, mode: "IDLE" },
                [rejectingPhone.inComingPhoneNumber]: { ...rejectedPhone, mode: "IDLE", callInfo: "Remote rejected!" }
            })
        );
    }

    const endCall = (phoneNumber: string) => {
        const sourcePhone = phoneList[phoneNumber];
        const remotePhone = phoneList[sourcePhone.inComingPhoneNumber];
        setPhoneList(prev => (
            {
                ...prev,
                [phoneNumber]: { ...sourcePhone, mode: "IDLE" },
                [sourcePhone.inComingPhoneNumber]: { ...remotePhone, mode: "IDLE" }
            })
        );
    }

    return (
        <div>
            {Object.keys(phoneList).map(phoneNumber => (
                <Phone
                    endCall={endCall}
                    rejectCall={rejectCall}
                    answerCall={answerCall}
                    makeCall={makeCall}
                    phoneNumber={phoneNumber}
                    phoneState={phoneList[phoneNumber]}
                    key={phoneNumber} />))}
        </div>
    );
}