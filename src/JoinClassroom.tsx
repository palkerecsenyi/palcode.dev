import React, { ReactElement, useCallback, useState } from 'react';
import firebase from 'firebase';
import 'firebase/firestore';
import { useAuth } from './helpers/auth';
import { Classroom } from './helpers/types';
import { useSnackbar } from 'notistack';

export default function JoinClassroom(): ReactElement {
    const [user] = useAuth();

    const [code, setCode] = useState('');
    const handleChange = useCallback((e) => {
        setCode(
            e.target.value ?
                e.target.value
                    .replace(/[^0-9]/g, '')
                    .padStart(6, '0')
                    .slice(-6)
                : '',
        );
    }, [code]);

    const {enqueueSnackbar} = useSnackbar();
    const [loading, setLoading] = useState(false);
    const joinClassroom = useCallback(() => {
        if (!user) return;

        setLoading(true);
        firebase
            .firestore()
            .collection('classrooms')
            .where('code', '==', code)
            .get()
            .then((data) => {
                if (!data.docs.length) {
                    setLoading(false);
                    setCode('');
                    enqueueSnackbar('That code was not found. Check that you\'ve entered it correctly and try again.', {
                        variant: 'error'
                    });

                    return;
                }

                const classroomData = data.docs[0].data() as Classroom;
                if (classroomData.members.includes(user.uid)) {
                    enqueueSnackbar('Looks like you\'re already a member of this classroom.', {
                        variant: 'info'
                    });
                    setLoading(false);
                    return;
                }

                firebase
                    .firestore()
                    .collection('classrooms')
                    .doc(data.docs[0].id)
                    .update({
                        members: classroomData.members.concat(user.uid)
                    } as Partial<Classroom>)
                    .then(() => {
                        setLoading(false);
                        enqueueSnackbar(`Joined classroom '${classroomData.name}' successfully.`, {
                            variant: 'success'
                        });
                    })
                    .catch(() => {
                        setLoading(false);
                        enqueueSnackbar(`Something went wrong joining classroom '${classroomData.name}'. Try again in a bit.`, {
                            variant: 'error'
                        });
                    });
            })
    }, [code, user]);

    return (
        <div className='join-classroom'>
            <h1>
                Join a classroom
            </h1>
            <p>
                Enter the code displayed on your teacher's screen in the box below to join the new classroom.
            </p>

            <input
                type='text'
                value={code}
                onChange={handleChange}
                disabled={loading}
            />

            <button
                onClick={joinClassroom}
                disabled={!user || loading}
            >
                Join
            </button>
        </div>
    );
}
