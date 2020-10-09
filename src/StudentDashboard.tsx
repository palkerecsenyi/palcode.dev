import React, { ReactElement } from 'react';
import { User } from './helpers/types';
import Loader from 'react-loader-spinner';
import ClassroomCard from './ui/ClassroomCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { useClassrooms } from './helpers/classroom';
import studentDashboard from './styles/studentDashboard.module.scss';
import loader from './styles/loader.module.scss';

interface Props {
    user: User
}

export default function StudentDashboard(
    {
        user,
    }: Props,
): ReactElement {
    const [classrooms, classroomsLoading] = useClassrooms(user.username);

    return (
        <div className={studentDashboard.dashboard}>
            <div className={studentDashboard.header}>
                <h1>
                    My classrooms
                </h1>
            </div>
            {
                classroomsLoading ? (
                    <div className={loader.loader}>
                        <Loader
                            type='Oval'
                            width={120}
                            height={120}
                            color='blue'
                        />
                    </div>
                ) : (
                    <div className={studentDashboard.classroomCardContainer}>
                        {
                            !classrooms.length && (
                                <p>
                                    You're not a part of any classrooms yet. Click the&nbsp;
                                    <FontAwesomeIcon icon={faPlus}/>
                                    &nbsp;button above to get started.
                                </p>
                            )
                        }
                        {
                            classrooms.map(classroom => (
                                <ClassroomCard
                                    classroom={classroom}
                                    key={classroom.id}
                                />
                            ))
                        }
                    </div>
                )
            }
        </div>
    );
}
