import { useState, useMemo, useCallback, useRef } from 'react';
import { Center, Stack, Text, Group, Button } from '@mantine/core';
import ScatterPlots from './scatterplot';
import Result from './responseFeedback';
import { StimulusParams } from '../../../store/types';
import { useNextStep } from '../../../store/hooks/useNextStep';

export default function PracticeScatter({
    setAnswer, parameters,
}: StimulusParams<{ r1: number; r2: number, taskid: string, shouldNegate: boolean, correlationDirection: string }>) {
    const [result, setResult] = useState<string | null>(null);
    const {r1, r2, taskid} = parameters;
    const shouldNegate = false;
    const correlationDirection = "positive";
    const r1DatasetName = `training/dataset_${r1}_size_100.csv`;
    const r2DatasetName = `training/dataset_${r2}_size_100.csv`;

    const buttonARef = useRef<HTMLButtonElement | null>(null);
    const buttonBRef = useRef<HTMLButtonElement | null>(null);

    const { goToNextStep } = useNextStep();

    // const handleClick = useCallback(
    //     (n: number) => {
    //         const correct = (n === 1 && r1 > r2) || (n === 2 && r2 > r1);
    //         setResult(correct ? 'Correct' : 'Incorrect');
    //         setAnswer({
    //             status: true,
    //             provenanceGraph: undefined,
    //             answers: {
    //                 [taskid]: correct,
    //             },
    //         });
    //     },
    //     [r1, r2, setAnswer, taskid],
    // );

    const [responded, setResponded] = useState<boolean>(false);

    const handleClick = (n: number) => {
        if (!responded) {
            console.log("this should run once");
            setResponded(true);
        
            const correct = (n === 1 && r1 > r2) || (n === 2 && r2 > r1);
            setResult(correct ? 'Correct' : 'Incorrect');
            setAnswer({
                status: true,
                provenanceGraph: undefined,
                answers: {[taskid]: correct},
            });

            const buttonA = document.getElementById("buttonA") as HTMLButtonElement;
            const buttonB = document.getElementById("buttonB") as HTMLButtonElement;

            if (n == 1) {
                buttonB.disabled = true;
            } else {
                buttonA.disabled = true;
            }
        }
    };

    return (
        <Stack style={{ width: '100%', height: '100%' }}>
            <Center>
                <Group style={{ gap: '80px' }}>
                    <Stack style={{ alignItems: 'center' }}>
                        <ScatterPlots onClick={() => handleClick(1)} r={r1} datasetName={r1DatasetName} />
                        <Button id='buttonA' ref={buttonARef} style={{ marginLeft: '-10px' }} onClick={() => handleClick(1)}>A</Button>
                    </Stack>
                    <Stack style={{ alignItems: 'center' }}>
                        <ScatterPlots onClick={() => handleClick(2)} r={r2} datasetName={r2DatasetName} />
                        <Button id='buttonB' ref={buttonBRef} style={{ marginLeft: '-10px' }} onClick={() => handleClick(2)}>B</Button>
                    </Stack>
                </Group>
            </Center>
            <Result result={result} r1={r1} r2={r2} shouldNegate={shouldNegate} showR={true}/>
        </Stack>
    );
}