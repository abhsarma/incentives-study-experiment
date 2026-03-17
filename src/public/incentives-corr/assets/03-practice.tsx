import { useState, useEffect, useRef } from 'react';
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

    const { goToNextStep } = useNextStep();

    // Keybinding for left (A) and right (B)
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'ArrowLeft' && buttonARef.current) {
                buttonARef.current.click();
            } else if (event.key === 'ArrowRight' && buttonBRef.current) {
                buttonBRef.current.click();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
            return () => {window.removeEventListener('keydown', handleKeyDown);};
    }, []);

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

            // setTimeout(() => {
            //     goToNextStep();
            // }, 1000);
        }
    };

    return (
        <Stack style={{ width: '100%', height: '100%' }}>
            <h3 className="trialHeader">Training Task</h3>
            <Text>
                <span className="questionPrompt">Please select the visualization that appears to have a larger correlation.</span>
                <span className="requiredQuestion">*</span><br/>
                <span className="questionSecondaryText">You can either click the buttons (A or B) or use the‚ left and right keys</span>
            </Text>
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