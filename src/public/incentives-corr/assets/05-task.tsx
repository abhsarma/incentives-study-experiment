import { useState, useMemo, useEffect, useRef } from 'react';
import { Center, Stack, Text, Group, Button } from '@mantine/core';
import ScatterPlots from './scatterplot';
import ParallelCoords from './parallelcoords';
import Result from './responseFeedback';
import { StimulusParams } from '../../../store/types';
import { useNextStep } from '../../../store/hooks/useNextStep';

export default function PracticeScatter({setAnswer, answers, parameters}: StimulusParams<{ r1: number; r2: number, vis: string, index: number}>) {
    const [result, setResult] = useState<string | null>(null);
    const {r1, r2, vis, index} = parameters;

    const r = useMemo(() => {
        return (Math.random() < 0.5 ? [r1, r2] : [r2, r1]); // randomly shuffle r1 or r2 is on the left;
    }, [r1, r2])
    const rr1 = r[0];
    const rr2 = r[1];

    const shouldNegate = false;
    const correlationDirection = "positive";
    const r1DatasetName = `test/dataset_${rr1}_size_100.csv`;
    const r2DatasetName = `test/dataset_${rr2}_size_100.csv`;

    const buttonARef = useRef<HTMLButtonElement | null>(null);
    const buttonBRef = useRef<HTMLButtonElement | null>(null);

    const { goToNextStep } = useNextStep();

    const [responded, setResponded] = useState<boolean>(false);

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
        
            const correct = (n === 1 && rr1 > rr2) || (n === 2 && rr2 > rr1);
            console.log(n, rr1, rr2, correct);
            const total = previousTotal? Number(previousTotal) + Number(correct) : Number(correct);

            setResult(correct ? 'Correct' : 'Incorrect');
            setAnswer({
                status: true,
                provenanceGraph: undefined,
                answers: {test: true, trial: index, r1: r1, r2: r2, response: n, answer: rr1 > rr2 ? 1 : 2, correct: correct, total: total},
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

    const current = useMemo(() => {
        return Object.entries(answers).find(([key, _]) => key.split("_")[0] === `test-${index}-${vis}`)?.[1];
    }, [answers, index]);

    const previousTotal:number = useMemo(() => {
        let previous = current ? Object.values(answers).find((val) => +val.trialOrder === +current.trialOrder - 1) : null;

        if (!previous) {
            return 0
        }

        return Number(previous.answer.total);
    }, [answers, index]);

    const trialIndex = useMemo(() => {
        if (current) {
            // gets the number of pre-trial pages by matching on first instance of trials in the `key` of the answers object
            // so that the correct trial index is shown to participants
            const intro_page_count = Number(Object.entries(answers).find(([key, _]) => key.split("_")[0].includes("test"))?.[0].split("_")[1]);
            
            const trialIndex = +current.trialOrder - intro_page_count + 1;
            return trialIndex < 1 ? 1 : trialIndex;
        } else {
            return 1
        }
    }, [answers, index]);

    // const awardText = "Your bonus is currently at $" + Math.round(previousTotal * 5) / 100

    // console.log("score:", previousTotal);

    return (
        <Stack style={{ width: '100%', height: '100%' }}>
            <h3 className="trialHeader">Trial number:<span id="task-index"> {trialIndex}</span>/65</h3>
            <Text>
                <span className="score">{trialIndex > 1 ? "You've correctly answered "+ previousTotal + " question(s) so far." : ''}</span><br/><br/>
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
            <Result result={result} r1={rr1} r2={rr2} shouldNegate={shouldNegate} showR={false}/>
        </Stack>
    );
}