import { useState, useMemo, useCallback, useRef } from 'react';
import { Center, Stack, Text, Group, Button } from '@mantine/core';
import ScatterPlots from './scatterplot';
import ParallelCoords from './parallelcoords';
import Result from './responseFeedback';
import { StimulusParams } from '../../../store/types';
import { useNextStep } from '../../../store/hooks/useNextStep';

export default function PracticeScatter({
    setAnswer, parameters,
}: StimulusParams<{ r1: number; r2: number, vis: string, index: number}>) {
    const [result, setResult] = useState<string | null>(null);
    const {r1, r2, vis, index} = parameters;

    const shouldNegate = false;
    const correlationDirection = "positive";
    const r1DatasetName = `training/dataset_${r1}_size_100.csv`;
    const r2DatasetName = `training/dataset_${r2}_size_100.csv`;

    const buttonARef = useRef<HTMLButtonElement | null>(null);
    const buttonBRef = useRef<HTMLButtonElement | null>(null);

    const [responded, setResponded] = useState<boolean>(false);

    const handleClick = (n: number) => {
        if (!responded) {
            setResponded(true);
        
            const correct = (n === 1 && r1 > r2) || (n === 2 && r2 > r1);
            setResult(correct ? 'Correct' : 'Incorrect');
            setAnswer({
                status: true,
                provenanceGraph: undefined,
                answers: {training: correct},
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
                        {vis == "scatter" ? 
                            <ScatterPlots onClick={() => handleClick(1)} datasetName={r1DatasetName} /> :
                            <ParallelCoords onClick={() => handleClick(1)} datasetName={r1DatasetName} /> }
                        <Button id='buttonA' ref={buttonARef} style={{ marginLeft: '-10px' }} onClick={() => handleClick(1)}>A</Button>
                    </Stack>
                    <Stack style={{ alignItems: 'center' }}>
                        {vis == "scatter" ? 
                            <ScatterPlots onClick={() => handleClick(2)} datasetName={r2DatasetName} /> :
                            <ParallelCoords onClick={() => handleClick(2)} datasetName={r2DatasetName} /> }
                        <Button id='buttonB' ref={buttonBRef} style={{ marginLeft: '-10px' }} onClick={() => handleClick(2)}>B</Button>
                    </Stack>
                </Group>
            </Center>
            <Result result={result} r1={r1} r2={r2} shouldNegate={shouldNegate} showR={true}/>
        </Stack>
    );
}