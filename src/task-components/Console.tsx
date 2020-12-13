import { killCode, runCode, stdin, useSocket, useStdout } from '../helpers/socket';
import React, { useCallback, useEffect, useMemo } from 'react';
import XtermWrapper from './XtermWrapper';
import editor from '../styles/editor.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlay, faSkull } from '@fortawesome/free-solid-svg-icons';
import { ThemeMetadata, useMonacoTheme } from '../helpers/monacoThemes';
import { TaskLanguage } from '../types';

export default function Console(
    {
        taskId,
        taskLanguage,
        themeMetadata,
    }: {
        taskId: string,
        taskLanguage?: TaskLanguage,
        themeMetadata?: ThemeMetadata,
    }
) {
    const socket = useSocket();

    const [lastStdout, lastStdoutID, running] = useStdout(socket, taskId);

    const run = useCallback(() => {
        if (!taskLanguage) return;
        runCode(socket, taskId, taskLanguage);
    }, [taskId, taskLanguage]);

    const kill = useCallback(() => {
        killCode(socket, taskId);
    }, [taskId]);

    const onKey = useCallback((key: string) => {
        stdin(socket, taskId, key);
    }, [running, taskId]);

    const [themeData] = useMonacoTheme(themeMetadata?.displayName);
    const xtermBackground = useMemo<string | undefined>(() => {
        if (!themeData) return undefined;
        return themeData.colors['editor.background'] || '#000000';
    }, [themeData]);

    return (
        <div className={editor.console}>
            {!running && (
                <button
                    onClick={run}
                    className={editor.runButton}
                    disabled={!taskLanguage}
                >
                    <FontAwesomeIcon icon={faPlay} />
                    &nbsp;Run
                </button>
            )}

            {running && (
                <button
                    onClick={kill}
                    className={editor.killButton}
                >
                    <FontAwesomeIcon icon={faSkull} />
                    &nbsp;Kill
                </button>
            )}

            <XtermWrapper
                lastStdout={lastStdout}
                lastStdoutID={lastStdoutID}
                onKey={onKey}
                enabled={running}
                backgroundColor={xtermBackground}
                useBlackText={themeMetadata?.light}
                taskId={taskId}
            />
        </div>
    )
}
