import {useCallback, useEffect, useRef, useState,} from 'react';
import { Text} from '@mantine/core';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';

export default function Result({result, r1, r2, shouldNegate, showR} : { result: string | null, r1: number, r2: number, shouldNegate: boolean, showR: boolean }) {
    return (
        <>
            {result && (
                <>
                    <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: result === 'Correct' ? 'green' : 'red'}}>
                        <Text style={{textAlign: 'center', marginTop: '12px', minHeight: '28px', fontSize: '18px', fontWeight: 'bold'}}>
                            {result === 'Correct' ? (
                            <>
                                <IconCircleCheck size={18} stroke={2} />
                                <span>Correct</span>
                            </>
                            ) : (
                            <>
                                <IconCircleX size={18} stroke={2} />
                                <span>Incorrect</span>
                            </>
                            )}
                        </Text>
                    </div>
                    {
                        showR ? 
                            <Text style={{ textAlign: 'center', minHeight: '28px' }}>{ `A is ${shouldNegate ? '-' : ''}${r1}, B is ${shouldNegate ? '-' : ''}${r2}`}</Text> : 
                            <></>
                    }
                </>
            )}
        </>
    );
}