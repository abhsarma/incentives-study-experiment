/**
 * Authors: The ReVISit team
 * Description:
 *    This file is the wrapper component for the Scatter plots
 */

import { Group, Stack, Button } from '@mantine/core';
import {
  useState, useRef, useCallback
} from 'react';
import { StoredAnswer, StimulusParams } from '../../../store/types';
import ScatterPlots from './scatterplot';

/**
 * Holds 2 Scatter Plots
 * @param param0 - r1 is the correlation value for 1, r2 is the correlation value for 2,
 * onClick is a function that determines the functionality when a graph is clicked.
 * @returns 2 Scatter Plots
 */
export default function ScatterWrapper({parameters, setAnswer}: StimulusParams<{test: boolean, vis: string, r1: number, r2: number, index: number}>) {

        const [result, setResult] = useState<string | null>(null);
        const { r1, r2, index, vis } = parameters;
        // const [key, setKey] = useState<number>(0);
        const buttonARef = useRef<HTMLButtonElement | null>(null);
        const buttonBRef = useRef<HTMLButtonElement | null>(null);

        const r1DatasetName = 'dataset_' + r1 + "_size_100.csv";
        const r2DatasetName = 'dataset_' + r2 + "_size_100.csv";

        const onClick = useCallback((n: number) => {
                const correct = (n === 1 && r1 > r2) || (n === 2 && r2 > r1);

                setResult(correct ? 'Correct' : 'Incorrect');
                setAnswer({
                    status: true,
                    answers: {[index]: correct},
                });
            }, [r1, r2, setAnswer, index]);

        // const handleReset = () => {
        //     if (shouldReRender) {
        //         setKey((prevKey) => prevKey + 1);
        //     }
        // };

        const handleClick = (n: number) => {
            onClick(n);
            // handleReset();
        };

        return (
            <Group style={{ gap: '180px' }}>
                <Stack style={{ alignItems: 'center' }}>
                    {/* <ScatterPlots key={key} onClick={() => handleClick(1)} r={r1} datasetName={r1DatasetName} /> */}
                    <ScatterPlots onClick={() => handleClick(1)} r={r1} datasetName={r1DatasetName} />
                    <Button ref={buttonARef} style={{ marginLeft: '-10px' }} onClick={() => handleClick(1)}>A</Button>
                </Stack>
                <Stack style={{ alignItems: 'center' }}>
                    <ScatterPlots onClick={() => handleClick(2)} r={r2} datasetName={r2DatasetName} />
                    <Button ref={buttonBRef} style={{ marginLeft: '-10px' }} onClick={() => handleClick(2)}>B</Button>
                </Stack>
            </Group>
        )

        // // Keybinding for left (A) and right (B)
        // useEffect(() => {
        //     const handleKeyDown = (event: KeyboardEvent) => {
        //         if (event.key === 'ArrowLeft' && buttonARef.current) {
        //             buttonARef.current.click();
        //         } else if (event.key === 'ArrowRight' && buttonBRef.current) {
        //             buttonBRef.current.click();
        //         }
        //     };

        //     window.addEventListener('keydown', handleKeyDown);
        //     return () => {
        //         window.removeEventListener('keydown', handleKeyDown);
        //     };
        // }, []);

    // return r1Left ? (
    //     <Group style={{ gap: '40px' }}>
    //         <Stack style={{ alignItems: 'center' }}>
    //             <ScatterPlots key={key} onClick={() => handleClick(1)} r={r1} shouldNegate={shouldNegate} datasetName={r1DatasetName} />
    //             <Button ref={buttonARef} style={{ marginLeft: '-10px' }} onClick={() => handleClick(1)}>A</Button>
    //         </Stack>
    //         <Stack style={{ alignItems: 'center' }}>
    //             <ScatterPlots key={key + 1} onClick={() => handleClick(2)} r={r2} shouldNegate={shouldNegate} datasetName={r2DatasetName} />
    //             <Button ref={buttonBRef} style={{ marginLeft: '-10px' }} onClick={() => handleClick(2)}>B</Button>
    //         </Stack>
    //     </Group>
    //     ) : (
    //     <Group style={{ gap: '40px' }}>
    //         <Stack style={{ alignItems: 'center' }}>
    //             <ScatterPlots key={key} onClick={() => handleClick(2)} r={r2} shouldNegate={shouldNegate} datasetName={r2DatasetName} />
    //             <Button ref={buttonARef} style={{ marginLeft: '-10px' }} onClick={() => handleClick(2)}>A</Button>
    //         </Stack>
    //         <Stack style={{ alignItems: 'center' }}>
    //             <ScatterPlots key={key + 1} onClick={() => handleClick(1)} r={r1} shouldNegate={shouldNegate} datasetName={r1DatasetName} />
    //             <Button ref={buttonBRef} style={{ marginLeft: '-10px' }} onClick={() => handleClick(1)}>B</Button>
    //         </Stack>
    //     </Group>
    // );
}