import { SubmissionTask, Task, TaskDoc, TaskType } from './types';
import { ReactElement, useEffect, useState } from 'react';
import firebase from 'firebase/app';
import 'firebase/firestore';

export function useTask(taskId: string): [Task | null, boolean] {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        return firebase.firestore()
            .collection('tasks')
            .doc(taskId)
            .onSnapshot(response => {
                setLoading(false);

                if (!response.exists) {
                    return;
                }

                setTask({
                    ...response.data() as TaskDoc,
                    id: response.id,
                } as Task);
            });
    }, [taskId]);

    return [task, loading];
}

export function useTasks(classroomId?: string, onlyTemplates = false): [Task[], boolean] {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tasksLoading, setTasksLoading] = useState(false);

    useEffect(() => {
        if (!classroomId) return;

        setTasksLoading(true);

        let baseQuery = firebase.firestore()
            .collection('tasks')
            .where('classroomId', '==', classroomId)

        if (onlyTemplates) {
            baseQuery = baseQuery.where('type', '==', TaskType.Template);
        }

        return baseQuery
            .onSnapshot(snapshot => {
                setTasksLoading(false);
                setTasks(snapshot.docs.map(e => ({
                    id: e.id,
                    ...e.data() as TaskDoc,
                } as Task)));
            }, e => console.log('EEE', e));
    }, [classroomId, onlyTemplates]);

    return [tasks, tasksLoading];
}

export function useSubmissions(taskId?: string): [SubmissionTask[], boolean] {
    const [submissions, setSubmissions] = useState<SubmissionTask[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!taskId) return;
        setLoading(true);

        return firebase
            .firestore()
            .collection('tasks')
            .where('parentTask', '==', taskId)
            .orderBy('created', 'desc')
            .onSnapshot(tasks => {
                setLoading(false);
                setSubmissions(
                    tasks.docs.map(task => ({
                        ...task.data() as TaskDoc,
                        id: task.id,
                    } as SubmissionTask))
                )
            });
    }, [taskId]);

    return [submissions, loading];
}
