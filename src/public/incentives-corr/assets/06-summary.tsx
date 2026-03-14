import * as d3 from 'd3';
import {useCallback, useEffect, useMemo, useState} from 'react';
import { StoredAnswer, StimulusParams } from '../../../store/types';
import '../../styles/incentives.css';

// Chart dimensions
const chartSettings = {
  marginBottom: 40,
  marginLeft: 40,
  marginTop: 15,
  marginRight: 15,
  width: 400,
  height: 400,
};

// This React component renders a bar chart with 5 bars and 2 of them highlighted by dots.
// The data value comes from the config file and pass to this component by parameters.
function DisplayTrial({ parameters, setAnswer, answers }: StimulusParams<{inc: string}>) {
    const { inc } = parameters;

    const incAmount = inc == "inc-sm" ? "3" : "2";

    const current = useMemo(() => {
        return Object.entries(answers).find(([key, _]) => key.split("_")[0].includes("qual-q"))?.[1];
    }, [answers]);

    const previousTotal:number = useMemo(() => {
        let previous = current ? Object.values(answers).find((val) => +val.trialOrder === +current.trialOrder - 1) : null;

        if (!previous) {
            return 0
        }

        return Number(previous.answer.total);
    }, [answers]);

    const bonus = previousTotal ? previousTotal * 0.05 : 0;
    const awardText = inc == "base" ? "" : ` This translates to a bonus of $${bonus}.`;
    console.log(bonus, awardText);

  return (
        <div className="chart-wrapper">
            <p>You have completed all the trials! <b>You have correctly answered <span id="remaining-budget">{previousTotal}</span>/45</b> of the trials.</p>
            <p><span id="actual-award">{awardText}</span></p>
            <p>Please answer the following open-ended questions regarding your experience in performing the tasks in this survey.</p>
        </div>
    );
}

export default DisplayTrial;
